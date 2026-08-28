import { motion, AnimatePresence } from "motion/react";
import { X, BookOpen, Image as ImageIcon, Heart, User, PenLine, Sparkles, Cloud } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDiary } from "../context/DiaryContext";
import { useGoogleDrive } from "../context/GoogleDriveContext";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const { setIsWriteModalOpen, setEditingEntry } = useDiary();
  const { setIsDriveModalOpen, isAuthenticated } = useGoogleDrive();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const links = [
    { name: "Günlüklerim", path: "/", icon: BookOpen, desc: "Tüm anılar ve maceralar" },
    { name: "Anı Defteri & Çizimler", path: "/photography", icon: ImageIcon, desc: "Fotoğraflar ve resimlerim" },
    { name: "Hafsa Hakkında", path: "/about", icon: User, desc: "Beni daha yakından tanıyın" },
  ];

  const handleOpenWrite = () => {
    onClose();
    setEditingEntry(null);
    setIsWriteModalOpen(true);
  };

  const handleOpenDrive = () => {
    onClose();
    setIsDriveModalOpen(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-ink/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[100] w-full max-w-sm bg-paper shadow-2xl flex flex-col border-r border-ink/5"
          >
            <div className="flex justify-between items-center p-6 border-b border-ink/5 bg-white/50">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌸</span>
                <span className="font-serif text-lg font-bold tracking-wide text-ink">HAFSA'NIN GÜNLÜĞÜ</span>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 text-ink-light hover:text-ink transition-colors rounded-lg hover:bg-ink/5"
                aria-label="Menüyü Kapat"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Quick Action Banner */}
            <div className="p-6 pb-2 space-y-2">
              <button
                onClick={handleOpenWrite}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-semibold text-white shadow-md hover:bg-accent/90 transition-all hover:scale-[1.02] active:scale-95"
              >
                <PenLine className="h-4 w-4" />
                <span>Yeni Günlük Sayfası Yaz ✨</span>
              </button>

              <button
                onClick={handleOpenDrive}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-4 py-2.5 font-semibold text-blue-700 hover:bg-blue-100 transition-all text-xs"
              >
                <Cloud className="h-4 w-4 text-blue-600" />
                <span>Google Drive Yedekleme {isAuthenticated ? "✅" : "☁️"}</span>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {links.map((link, idx) => {
                const IconComponent = link.icon;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.08 }}
                  >
                    <Link 
                      to={link.path} 
                      onClick={onClose}
                      className="group flex items-start gap-4 p-3.5 rounded-xl hover:bg-white transition-all border border-transparent hover:border-ink/5 shadow-none hover:shadow-sm"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-serif text-lg font-semibold text-ink group-hover:text-accent transition-colors">
                          {link.name}
                        </span>
                        <span className="text-xs text-ink-light">
                          {link.desc}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            
            <div className="p-6 border-t border-ink/5 bg-white/40">
              <div className="flex items-center gap-2 text-xs text-ink-light">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>Küçük bir kalbin renkli dünyası</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

