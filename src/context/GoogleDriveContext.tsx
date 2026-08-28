import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  googleSignOut, 
  getAccessToken, 
  setAccessToken 
} from '../lib/firebase';
import { 
  backupEntriesToDrive, 
  exportSingleEntryToDrive, 
  listDiaryDriveFiles, 
  restoreEntriesFromDrive, 
  deleteDriveFile,
  type DriveFileItem 
} from '../services/googleDrive';
import type { DiaryEntry } from '../types';
import { useDiary } from './DiaryContext';

interface GoogleDriveContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  isDriveModalOpen: boolean;
  setIsDriveModalOpen: (open: boolean) => void;
  signInWithGoogle: () => Promise<boolean>;
  signOutGoogle: () => Promise<void>;
  backupAllEntries: () => Promise<{ success: boolean; message: string; fileName?: string }>;
  exportEntry: (entry: DiaryEntry) => Promise<{ success: boolean; message: string; fileName?: string }>;
  fetchDriveFiles: () => Promise<DriveFileItem[]>;
  restoreBackup: (fileId: string, fileName: string) => Promise<number>;
  deleteBackupFile: (fileId: string, fileName: string) => Promise<boolean>;
}

const GoogleDriveContext = createContext<GoogleDriveContextType | undefined>(undefined);

export function GoogleDriveProvider({ children }: { children: React.ReactNode }) {
  const { entries } = useDiary();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem('hafsa_last_drive_sync') || null;
  });
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (authUser, token) => {
        setUser(authUser);
        setToken(token);
        setIsLoadingAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsLoadingAuth(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      setIsLoadingAuth(true);
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Google Giriş Hatası:', err);
      alert(`Google ile giriş yapılamadı: ${err.message || 'Lütfen tekrar deneyin.'}`);
      return false;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const signOutGoogle = async () => {
    try {
      await googleSignOut();
      setUser(null);
      setToken(null);
      setAccessToken(null);
    } catch (err) {
      console.error('Çıkış hatası:', err);
    }
  };

  const backupAllEntries = async () => {
    let token = accessToken || (await getAccessToken());
    if (!token) {
      const signedIn = await signInWithGoogle();
      if (!signedIn) {
        return { success: false, message: 'Google girişi gerekli' };
      }
      token = await getAccessToken();
      if (!token) return { success: false, message: 'Token alınamadı' };
    }

    try {
      setIsSyncing(true);
      const result = await backupEntriesToDrive(token, entries);
      const syncDate = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(syncDate);
      localStorage.setItem('hafsa_last_drive_sync', syncDate);
      return { 
        success: true, 
        message: `${entries.length} adet günlük başarıyla Google Drive'a yedeklendi!`,
        fileName: result.name
      };
    } catch (err: any) {
      console.error('Yedekleme Hatası:', err);
      return { success: false, message: err.message || 'Yedekleme sırasında bir hata oluştu' };
    } finally {
      setIsSyncing(false);
    }
  };

  const exportEntry = async (entry: DiaryEntry) => {
    let token = accessToken || (await getAccessToken());
    if (!token) {
      const signedIn = await signInWithGoogle();
      if (!signedIn) {
        return { success: false, message: 'Google girişi gerekli' };
      }
      token = await getAccessToken();
      if (!token) return { success: false, message: 'Token alınamadı' };
    }

    try {
      setIsSyncing(true);
      const res = await exportSingleEntryToDrive(token, entry);
      return {
        success: true,
        message: `"${entry.title}" başlıklı günlük Google Drive'a başarıyla kaydedildi!`,
        fileName: res.name
      };
    } catch (err: any) {
      console.error('Tekil kayıt hatası:', err);
      return { success: false, message: err.message || 'Kayıt sırasında bir sorun oluştu' };
    } finally {
      setIsSyncing(false);
    }
  };

  const fetchDriveFiles = useCallback(async (): Promise<DriveFileItem[]> => {
    const token = accessToken || (await getAccessToken());
    if (!token) return [];
    try {
      return await listDiaryDriveFiles(token);
    } catch (err) {
      console.error('Dosya listeleme hatası:', err);
      return [];
    }
  }, [accessToken]);

  const restoreBackup = async (fileId: string, fileName: string): Promise<number> => {
    const token = accessToken || (await getAccessToken());
    if (!token) {
      throw new Error('Google girişi gerekli');
    }

    // Explicit confirmation for mutating operation
    const confirmed = window.confirm(
      `"${fileName}" yedeğindeki anıları geri yüklemek istiyor musunuz? Mevcut günlükleriniz güncellenecektir.`
    );
    if (!confirmed) return 0;

    setIsSyncing(true);
    try {
      const restored = await restoreEntriesFromDrive(token, fileId);
      if (restored && restored.length > 0) {
        // Save to localStorage
        localStorage.setItem('kucuk_hafsa_gunlukleri_v1', JSON.stringify(restored));
        window.location.reload(); // Reload to refresh state
        return restored.length;
      }
      return 0;
    } catch (err: any) {
      alert(`Geri yükleme hatası: ${err.message}`);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteBackupFile = async (fileId: string, fileName: string): Promise<boolean> => {
    const token = accessToken || (await getAccessToken());
    if (!token) {
      throw new Error('Google girişi gerekli');
    }

    // Explicit confirmation for destructive operation
    const confirmed = window.confirm(
      `"${fileName}" dosyasını Google Drive'ınızdan kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
    );
    if (!confirmed) return false;

    try {
      await deleteDriveFile(token, fileId);
      return true;
    } catch (err: any) {
      alert(`Silme hatası: ${err.message}`);
      return false;
    }
  };

  return (
    <GoogleDriveContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isLoadingAuth,
        isSyncing,
        lastSyncTime,
        isDriveModalOpen,
        setIsDriveModalOpen,
        signInWithGoogle,
        signOutGoogle,
        backupAllEntries,
        exportEntry,
        fetchDriveFiles,
        restoreBackup,
        deleteBackupFile,
      }}
    >
      {children}
    </GoogleDriveContext.Provider>
  );
}

export function useGoogleDrive() {
  const context = useContext(GoogleDriveContext);
  if (!context) {
    throw new Error('useGoogleDrive must be used within a GoogleDriveProvider');
  }
  return context;
}
