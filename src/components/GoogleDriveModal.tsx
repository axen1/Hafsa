import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Cloud, CloudUpload, RefreshCw, Trash2, CheckCircle2, 
  AlertCircle, ExternalLink, Download, FileText, Folder, Shield, Sparkles, LogOut, Check
} from "lucide-react";
import { useGoogleDrive } from "../context/GoogleDriveContext";
import { useDiary } from "../context/DiaryContext";
import type { DriveFileItem } from "../services/googleDrive";

export function GoogleDriveModal() {
  const { 
    isDriveModalOpen, 
    setIsDriveModalOpen, 
    user, 
    isAuthenticated, 
    isLoadingAuth, 
    isSyncing, 
    lastSyncTime, 
    signInWithGoogle, 
    signOutGoogle, 
    backupAllEntries, 
    fetchDriveFiles, 
    restoreBackup, 
    deleteBackupFile 
  } = useGoogleDrive();

  const { entries } = useDiary();

  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const loadFiles = async () => {
    if (!isAuthenticated) return;
    setLoadingFiles(true);
    try {
      const fileList = await fetchDriveFiles();
      setFiles(fileList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (isDriveModalOpen && isAuthenticated) {
      loadFiles();
    }
  }, [isDriveModalOpen, isAuthenticated]);

  const handleBackup = async () => {
    setStatusMessage(null);
    const res = await backupAllEntries();
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
      loadFiles();
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const handleRestore = async (fileId: string, fileName: string) => {
    try {
      setStatusMessage({ type: 'info', text: 'Yedek geri yükleniyor...' });
      const count = await restoreBackup(fileId, fileName);
      if (count > 0) {
        setStatusMessage({ type: 'success', text: `${count} adet günlük geri yüklendi!` });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Geri yükleme başarısız oldu' });
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    const success = await deleteBackupFile(fileId, fileName);
    if (success) {
      setStatusMessage({ type: 'success', text: `"${fileName}" Google Drive'dan silindi.` });
      setFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  return (
    <AnimatePresence>
      {isDriveModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDriveModalOpen(false)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl rounded-3xl bg-paper shadow-2xl border border-ink/10 overflow-hidden z-10 my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/5 bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Cloud className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
                    <span>Google Drive Anı Yedekleme</span>
                    <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Bulut Senkronizasyonu
                    </span>
                  </h3>
                  <p className="text-xs text-ink-light">
                    Günlüklerini ve çizimlerini Google Drive hesabında güvenle sakla
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDriveModalOpen(false)}
                className="rounded-full p-2 text-ink-light hover:bg-ink/5 hover:text-ink transition-colors"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
              {/* Account Connection Status */}
              <div className="rounded-2xl bg-white p-5 border border-ink/5 shadow-sm">
                {!isAuthenticated ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-paper flex items-center justify-center text-xl">
                        🔒
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-ink">Google Hesabı Bağlı Değil</h4>
                        <p className="text-xs text-ink-light">
                          Günlükleri Drive'a kaydetmek için Google hesabınızla giriş yapın.
                        </p>
                      </div>
                    </div>

                    {/* Official Sign-In Style Button */}
                    <button
                      onClick={() => signInWithGoogle()}
                      disabled={isLoadingAuth}
                      className="group relative flex items-center gap-3 rounded-full border border-ink/15 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-ink shadow-sm hover:bg-paper hover:shadow transition-all disabled:opacity-50"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                      <span>{isLoadingAuth ? "Bağlanıyor..." : "Google ile Giriş Yap"}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {user?.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || "Google Kullanıcısı"} 
                          className="h-11 w-11 rounded-full border border-blue-200" 
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {user?.displayName?.[0] || "U"}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-bold text-ink">
                            {user?.displayName || "Google Kullanıcısı"}
                          </span>
                          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                            <Check className="h-3 w-3" /> Bağlandı
                          </span>
                        </div>
                        <p className="text-xs text-ink-light">{user?.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={signOutGoogle}
                      className="flex items-center gap-1.5 text-xs text-ink-light hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Status banner */}
              {statusMessage && (
                <div className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                  statusMessage.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : statusMessage.type === 'error'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  {statusMessage.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />}
                  {statusMessage.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />}
                  {statusMessage.type === 'info' && <RefreshCw className="h-4 w-4 shrink-0 text-blue-600 animate-spin" />}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-blue-50/50 border border-blue-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-bold text-sm text-ink flex items-center gap-1.5">
                        <CloudUpload className="h-4 w-4 text-blue-600" />
                        <span>Hemen Yedekle</span>
                      </span>
                      <span className="text-[10px] text-ink-light font-medium bg-white px-2 py-0.5 rounded-full border border-ink/5">
                        {entries.length} Anı
                      </span>
                    </div>
                    <p className="text-xs text-ink-light leading-relaxed mb-4">
                      Tüm günlük sayfalarını, fotoğrafları ve çizimleri tek tıkla Google Drive'ındaki özel klasöre aktar.
                    </p>
                  </div>

                  <button
                    onClick={handleBackup}
                    disabled={isSyncing}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Yedekleniyor...</span>
                      </>
                    ) : (
                      <>
                        <CloudUpload className="h-3.5 w-3.5" />
                        <span>Google Drive'a Yedekle ✨</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-ink/5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-bold text-sm text-ink flex items-center gap-1.5">
                        <Shield className="h-4 w-4 text-accent" />
                        <span>Güvenli & Özel Klasör</span>
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                        🌸 Özel
                      </span>
                    </div>
                    <p className="text-xs text-ink-light leading-relaxed mb-4">
                      Yedekleriniz Google Drive hesabınızda <strong>"🌸 Hafsa'nın Günlüğü"</strong> adlı özel bir klasörde saklanır.
                    </p>
                  </div>

                  {lastSyncTime && (
                    <div className="text-[11px] text-ink-light flex items-center justify-between pt-2 border-t border-ink/5">
                      <span>Son Yedekleme:</span>
                      <span className="font-semibold text-ink">{lastSyncTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Files in Google Drive Section */}
              <div className="rounded-2xl bg-white p-5 border border-ink/5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-blue-600" />
                    <h4 className="font-serif text-sm font-bold text-ink">
                      Drive'daki Anı ve Yedek Dosyaları
                    </h4>
                  </div>
                  {isAuthenticated && (
                    <button
                      onClick={loadFiles}
                      disabled={loadingFiles}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className={`h-3 w-3 ${loadingFiles ? 'animate-spin' : ''}`} />
                      <span>Yenile</span>
                    </button>
                  )}
                </div>

                {!isAuthenticated ? (
                  <p className="text-xs text-ink-light italic text-center py-6">
                    Drive dosyalarınızı görmek için lütfen yukarıdan Google ile giriş yapın.
                  </p>
                ) : loadingFiles ? (
                  <div className="py-8 text-center text-xs text-ink-light flex flex-col items-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                    <span>Google Drive dosyaları taranıyor...</span>
                  </div>
                ) : files.length === 0 ? (
                  <div className="py-8 text-center text-xs text-ink-light">
                    <p className="text-2xl mb-1">📁</p>
                    <p>Henüz Drive klasörünüzde kayıtlı bir dosya yok.</p>
                    <p className="mt-1 text-[11px] text-blue-600 font-medium">
                      Yukarıdaki "Hemen Yedekle" butonuyla ilk yedeğini alabilirsin!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {files.map((file) => {
                      const isJson = file.name.endsWith('.json');
                      return (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-paper/60 hover:bg-paper border border-ink/5 transition-all text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <FileText className={`h-4 w-4 shrink-0 ${isJson ? 'text-emerald-600' : 'text-blue-600'}`} />
                            <div className="min-w-0">
                              <p className="font-medium text-ink truncate font-mono text-[11px]">
                                {file.name}
                              </p>
                              <p className="text-[10px] text-ink-light">
                                {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString('tr-TR') : ''} 
                                {file.size ? ` • ${Math.round(parseInt(file.size) / 1024)} KB` : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-ink-light hover:text-blue-600 hover:bg-white transition-colors"
                                title="Drive'da Aç"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}

                            {isJson && (
                              <button
                                onClick={() => handleRestore(file.id, file.name)}
                                className="p-1.5 rounded-lg text-ink-light hover:text-emerald-700 hover:bg-white transition-colors"
                                title="Bu Yedeği Geri Yükle"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(file.id, file.name)}
                              className="p-1.5 rounded-lg text-ink-light hover:text-red-600 hover:bg-white transition-colors"
                              title="Dosyayı Sil"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-ink/5 bg-white px-6 py-3.5 flex items-center justify-between text-xs text-ink-light">
              <span className="flex items-center gap-1 text-[11px]">
                <Sparkles className="h-3 w-3 text-accent" />
                <span>Google Drive güvenliğiyle anıların hep yanında</span>
              </span>
              <button
                onClick={() => setIsDriveModalOpen(false)}
                className="rounded-xl px-4 py-1.5 font-medium text-ink hover:bg-paper transition-colors"
              >
                Kapat
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
