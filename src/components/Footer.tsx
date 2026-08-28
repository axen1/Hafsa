import { Link } from "react-router-dom";
import { Heart, Sparkles, PenLine } from "lucide-react";
import { useDiary } from "../context/DiaryContext";

export function Footer() {
  const { setIsWriteModalOpen, setEditingEntry } = useDiary();

  const handleOpenWrite = () => {
    setEditingEntry(null);
    setIsWriteModalOpen(true);
  };

  return (
    <footer className="border-t border-ink/10 bg-white/70 py-12 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌸</span>
              <span className="font-serif text-xl font-bold tracking-tight text-ink">
                Küçük Hafsa'nın Günlüğü
              </span>
            </div>
            <p className="text-sm text-ink-light max-w-xs leading-relaxed">
              Her yeni gün, yazılmayı bekleyen renkli bir masaldır. Hafsa'nın çocukluk anıları, çizimleri ve sevinçleri burada yaşıyor.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">Keşfet & Oku</h4>
            <nav className="flex flex-col gap-2 text-sm text-ink-light">
              <Link to="/" className="hover:text-accent transition-colors">Tüm Günlük Sayfaları</Link>
              <Link to="/photography" className="hover:text-accent transition-colors">Anı Defteri & Çizimler</Link>
              <Link to="/about" className="hover:text-accent transition-colors">Hafsa Kimdir?</Link>
            </nav>
          </div>
          
          {/* New Entry Callout */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">Günlük Tutmak</h4>
            <p className="text-sm text-ink-light">
              Bugün hissettiklerini ve yaşadığın güzel anları unutmamak için hemen yaz!
            </p>
            <button
              onClick={handleOpenWrite}
              className="inline-flex items-center gap-2 w-fit rounded-xl bg-accent/15 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent hover:text-white transition-all shadow-sm"
            >
              <PenLine className="h-4 w-4" />
              <span>Yeni Anı Ekle ✨</span>
            </button>
          </div>
        </div>
        
        {/* Bottom copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink/5 pt-6 sm:flex-row text-center sm:text-left">
          <p className="text-xs text-ink-light flex items-center gap-1">
            <span>Küçük Hafsa için sevgiyle hazırlandı</span>
            <Heart className="h-3 w-3 text-rose-500 fill-current inline" />
          </p>
          <p className="text-xs text-ink-light">
            &copy; {new Date().getFullYear()} Hafsa'nın Anı Dünyası. Tüm hayaller saklıdır 🌟
          </p>
        </div>
      </div>
    </footer>
  );
}

