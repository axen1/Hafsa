import { motion, AnimatePresence } from "motion/react";
import { Search, X, Calendar, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDiary } from "../context/DiaryContext";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const { entries } = useDiary();
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setQuery("");
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const cleanQuery = query.toLowerCase().trim();
  const results = cleanQuery.length > 0 
    ? entries.filter(a => 
        a.title.toLowerCase().includes(cleanQuery) || 
        a.excerpt.toLowerCase().includes(cleanQuery) ||
        a.content.toLowerCase().includes(cleanQuery) ||
        (a.category && a.category.toLowerCase().includes(cleanQuery)) ||
        (a.tags && a.tags.some(t => t.toLowerCase().includes(cleanQuery))) ||
        (a.mood && a.mood.label.toLowerCase().includes(cleanQuery))
      )
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-paper/98 backdrop-blur-md flex flex-col"
        >
          <div className="flex justify-between items-center px-6 py-4 border-b border-ink/5">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔍</span>
              <span className="font-serif text-lg font-bold text-ink">Günlüklerimde Ara</span>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-ink-light hover:text-ink transition-colors rounded-lg hover:bg-ink/5"
              aria-label="Aramayı Kapat"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-24">
            <div className="mx-auto max-w-3xl pt-8 sm:pt-12">
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-7 text-accent" />
                <input 
                  type="text" 
                  placeholder="Kelimeler, anılar, kediler, bisiklet, resim..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent border-b-2 border-ink/20 py-4 pl-12 pr-4 text-2xl sm:text-3xl font-serif text-ink placeholder:text-ink/30 focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              
              <div className="mt-12 flex flex-col gap-6">
                {cleanQuery.length > 0 && results.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-ink-light text-lg">"{query}" ile ilgili bir anı bulunamadı.</p>
                    <p className="text-xs text-ink-light/70 mt-1">Farklı bir kelime deneyebilir veya yeni bir günlük yazabilirsin!</p>
                  </div>
                )}

                {results.map((article, idx) => (
                  <motion.div 
                    key={article.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-xl bg-white/80 hover:bg-white border border-ink/5 hover:border-accent/30 transition-all shadow-sm"
                  >
                    <Link to={`/post/${article.slug}`} onClick={onClose} className="group block">
                      <div className="flex items-center gap-2 text-xs font-semibold text-accent mb-1.5">
                        <span>{article.mood?.emoji} {article.category}</span>
                        <span>•</span>
                        <span className="text-ink-light flex items-center gap-1 font-normal">
                          <Calendar className="h-3 w-3" /> {article.date}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-ink group-hover:text-accent transition-colors mb-1.5">
                        {article.title}
                      </h3>
                      <p className="text-sm text-ink-light line-clamp-2">
                        {article.excerpt}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

