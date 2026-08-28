import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Search, Menu, PenLine, BookOpen, Cloud, Check } from "lucide-react";
import { useState } from "react";
import { MenuOverlay } from "./MenuOverlay";
import { SearchOverlay } from "./SearchOverlay";
import { useDiary } from "../context/DiaryContext";
import { useGoogleDrive } from "../context/GoogleDriveContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { setIsWriteModalOpen, setEditingEntry } = useDiary();
  const { setIsDriveModalOpen, isAuthenticated, user, isSyncing } = useGoogleDrive();

  const handleOpenWriteModal = () => {
    setEditingEntry(null);
    setIsWriteModalOpen(true);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 w-full border-b border-ink/5 bg-paper/90 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-ink-light hover:text-ink transition-colors rounded-lg hover:bg-ink/5"
              aria-label="Menüyü Aç"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link 
              to="/" 
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-ink-light hover:text-ink transition-colors"
            >
              <BookOpen className="h-4 w-4 text-accent" />
              <span>Anılarım</span>
            </Link>
          </div>
          
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="text-xl">🌸</span>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-ink group-hover:text-accent transition-colors">
              Hafsa'nın Günlüğü
            </span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-ink-light hover:text-ink transition-colors rounded-lg hover:bg-ink/5"
              aria-label="Günlüklerde Ara"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Google Drive Sync Trigger Button */}
            <button
              onClick={() => setIsDriveModalOpen(true)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all border ${
                isAuthenticated
                  ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  : "bg-white text-ink-light border-ink/10 hover:border-blue-300 hover:text-blue-600"
              }`}
              title="Google Drive Yedekleme ve Senkronizasyon"
            >
              <Cloud className={`h-4 w-4 ${isSyncing ? 'animate-bounce text-blue-600' : 'text-blue-600'}`} />
              <span className="hidden md:inline">
                {isAuthenticated ? (user?.displayName?.split(' ')[0] || "Drive") : "Drive Yedek"}
              </span>
              {isAuthenticated && (
                <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white hidden md:inline-block" />
              )}
            </button>

            <Link 
              to="/about" 
              className="hidden text-sm font-medium text-ink-light hover:text-ink lg:block transition-colors px-2 py-1"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Hafsa Hakkında
            </Link>

            <button
              onClick={handleOpenWriteModal}
              className="flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-accent/90 transition-all hover:scale-105 active:scale-95"
            >
              <PenLine className="h-4 w-4" />
              <span className="hidden xs:inline">Günlük Yaz</span>
            </button>
          </div>
        </div>
      </motion.header>

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

