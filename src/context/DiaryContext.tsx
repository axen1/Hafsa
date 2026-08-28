import React, { createContext, useContext, useState, useEffect } from "react";
import { DiaryEntry, initialEntries, defaultAuthor } from "../data/diaryData";

interface DiaryContextType {
  entries: DiaryEntry[];
  addEntry: (entry: Omit<DiaryEntry, "id" | "slug" | "author" | "readTime" | "date"> & { slug?: string; date?: string }) => DiaryEntry;
  updateEntry: (id: string, updated: Partial<DiaryEntry>) => void;

  deleteEntry: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addReaction: (id: string, emoji: string) => void;
  getEntryBySlug: (slug: string) => DiaryEntry | undefined;
  isWriteModalOpen: boolean;
  setIsWriteModalOpen: (open: boolean) => void;
  editingEntry: DiaryEntry | null;
  setEditingEntry: (entry: DiaryEntry | null) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = "kucuk_hafsa_gunlukleri_v1";

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

function slugify(text: string): string {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i',
    'İ': 'i', 'i': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u'
  };

  let clean = text;
  Object.keys(trMap).forEach((char) => {
    clean = clean.replace(new RegExp(char, 'g'), trMap[char]);
  });

  return clean
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 60);
}

function calculateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 150));
  return `${minutes} dk okuma`;
}

function formatTurkishDate(dateObj: Date): string {
  const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
}

export function DiaryProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load diary entries from storage:", e);
    }
    return initialEntries;
  });

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Failed to save diary entries to storage:", e);
    }
  }, [entries]);

  const addEntry = (data: Omit<DiaryEntry, "id" | "slug" | "author" | "readTime" | "date"> & { slug?: string; date?: string }) => {
    const id = `entry-${Date.now()}`;
    const baseSlug = slugify(data.title) || `gunluk-${Date.now()}`;
    // ensure unique slug
    let slug = baseSlug;
    let count = 1;
    while (entries.some(e => e.slug === slug)) {
      slug = `${baseSlug}-${count++}`;
    }

    const todayDate = data.date || formatTurkishDate(new Date());
    const readTime = calculateReadTime(data.content || data.excerpt || "");

    const newEntry: DiaryEntry = {
      ...data,
      id,
      slug,
      date: todayDate,
      readTime,
      author: defaultAuthor,
      reactions: data.reactions || { "❤️": 1, "✨": 1 }
    };

    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  };

  const updateEntry = (id: string, updated: Partial<DiaryEntry>) => {
    setEntries(prev =>
      prev.map(item => {
        if (item.id === id) {
          const content = updated.content !== undefined ? updated.content : item.content;
          const readTime = calculateReadTime(content);
          return {
            ...item,
            ...updated,
            readTime
          };
        }
        return item;
      })
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(item => item.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setEntries(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const addReaction = (id: string, emoji: string) => {
    setEntries(prev =>
      prev.map(item => {
        if (item.id === id) {
          const currentReactions = item.reactions || {};
          const currentCount = currentReactions[emoji] || 0;
          return {
            ...item,
            reactions: {
              ...currentReactions,
              [emoji]: currentCount + 1
            }
          };
        }
        return item;
      })
    );
  };

  const getEntryBySlug = (slug: string) => {
    return entries.find(e => e.slug === slug);
  };

  const resetToDefaults = () => {
    setEntries(initialEntries);
  };

  return (
    <DiaryContext.Provider
      value={{
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        toggleFavorite,
        addReaction,
        getEntryBySlug,
        isWriteModalOpen,
        setIsWriteModalOpen,
        editingEntry,
        setEditingEntry,
        resetToDefaults
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
}

export function useDiary() {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error("useDiary must be used within a DiaryProvider");
  }
  return context;
}
