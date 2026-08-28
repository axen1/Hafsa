import type { DiaryEntry } from '../types';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
  iconLink?: string;
}

const FOLDER_NAME = "🌸 Hafsa'nın Günlüğü";

/**
 * Searches for or creates a dedicated folder in user's Google Drive
 */
export async function getOrCreateDiaryFolder(accessToken: string): Promise<string> {
  const query = encodeURIComponent(
    `name = '${FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );
  
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&spaces=drive`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!searchRes.ok) {
    const errorData = await searchRes.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Google Drive klasörü aranırken bir hata oluştu');
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder if not found
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: "Hafsa'nın Günlük uygulaması anı ve yedekleme klasörü",
    }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Google Drive klasörü oluşturulamadı');
  }

  const folderData = await createRes.json();
  return folderData.id;
}

/**
 * Backs up all diary entries as JSON to Google Drive
 */
export async function backupEntriesToDrive(
  accessToken: string,
  entries: DiaryEntry[]
): Promise<{ fileId: string; name: string }> {
  const folderId = await getOrCreateDiaryFolder(accessToken);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileName = `Hafsa_Gunluk_Yedek_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.json`;

  const backupData = {
    appName: "Küçük Hafsa'nın Günlüğü",
    backupDate: new Date().toISOString(),
    totalEntries: entries.length,
    version: '1.0',
    entries: entries,
  };

  const fileContent = JSON.stringify(backupData, null, 2);
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    parents: [folderId],
    description: `Küçük Hafsa'nın Günlüğü Yedek Dosyası (${entries.length} adet anı)`,
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Google Drive yedekleme başarısız oldu');
  }

  const data = await res.json();
  return { fileId: data.id, name: fileName };
}

/**
 * Exports a single entry as a readable text document to Google Drive
 */
export async function exportSingleEntryToDrive(
  accessToken: string,
  entry: DiaryEntry
): Promise<{ fileId: string; name: string }> {
  const folderId = await getOrCreateDiaryFolder(accessToken);
  const safeTitle = entry.title.replace(/[/\\?%*:|"<>]/g, '_');
  const fileName = `📖 ${entry.date} - ${safeTitle}.txt`;

  const formattedText = `=====================================================
🌸 KÜÇÜK HAFSA'NIN GÜNLÜĞÜ 🌸
=====================================================
Başlık      : ${entry.title}
Tarih       : ${entry.date}
Kategori    : ${entry.category || 'Günlük'}
Ruh Hali    : ${entry.mood ? `${entry.mood.emoji} ${entry.mood.label}` : 'Belirtilmedi'}
Hava Durumu : ${entry.weather ? `${entry.weather.emoji} ${entry.weather.label}` : 'Belirtilmedi'}
Okuma Süresi: ${entry.readTime}
Etiketler   : ${entry.tags ? entry.tags.join(', ') : 'Yok'}
=====================================================

ÖZET:
"${entry.excerpt}"

GÜNLÜK METNİ:
${entry.content}

${entry.quote ? `\nAlıntı / Özlü Söz:\n"${entry.quote.text}" - ${entry.quote.author || 'Hafsa'}\n` : ''}
=====================================================
Kaydedilme Zamanı: ${new Date().toLocaleString('tr-TR')}
`;

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    mimeType: 'text/plain',
    parents: [folderId],
    description: `Hafsa'nın Günlük Yazısı: ${entry.title}`,
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
    formattedText +
    closeDelimiter;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Yazı Google Drive\'a aktarılamadı');
  }

  const data = await res.json();
  return { fileId: data.id, name: fileName };
}

/**
 * Lists all backup files and diary documents in the app folder
 */
export async function listDiaryDriveFiles(accessToken: string): Promise<DriveFileItem[]> {
  const folderId = await getOrCreateDiaryFolder(accessToken);
  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,createdTime,modifiedTime,size,webViewLink,iconLink)&orderBy=modifiedTime desc`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Google Drive dosyaları listelenemedi');
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Downloads and restores entries from a JSON backup file in Google Drive
 */
export async function restoreEntriesFromDrive(
  accessToken: string,
  fileId: string
): Promise<DiaryEntry[]> {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Yedek dosyası indirilemedi');
  }

  const json = await res.json();
  if (Array.isArray(json.entries)) {
    return json.entries;
  } else if (Array.isArray(json)) {
    return json;
  } else {
    throw new Error('Yedek dosyası geçerli günlük kayıtları içermiyor');
  }
}

/**
 * Deletes a file from Google Drive
 */
export async function deleteDriveFile(accessToken: string, fileId: string): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok && res.status !== 204) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Dosya silinirken hata oluştu');
  }
}
