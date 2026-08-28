import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Heart, Calendar, Clock, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import type { DiaryEntry } from "../data/diaryData";
import { cn } from "../lib/utils";
import { FadeImage } from "./FadeImage";
import { useDiary } from "../context/DiaryContext";

interface ArticleCardProps {
  article: DiaryEntry;
  featured?: boolean;
  index: number;
}

export function ArticleCard({ article, featured = false, index }: ArticleCardProps) {
  const { toggleFavorite, deleteEntry, setEditingEntry, setIsWriteModalOpen } = useDiary();
  const [showMenu, setShowMenu] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingEntry(article);
    setIsWriteModalOpen(true);
    setShowMenu(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`"${article.title}" başlıklı günlük yazısını silmek istiyor musunuz?`)) {
      deleteEntry(article.id);
    }
    setShowMenu(false);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(article.id);
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col rounded-2xl bg-white p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-ink/5 hover:border-accent/20",
        featured ? "lg:flex-row lg:items-center lg:gap-10 p-6 sm:p-8" : "gap-5"
      )}
    >
      {/* Cover / Drawing Image */}
      <div className={cn(
        "relative block overflow-hidden rounded-xl bg-ink/5",
        featured ? "aspect-[16/9] lg:aspect-[4/3] lg:w-1/2" : "aspect-[16/10] w-full"
      )}>
        <Link to={`/post/${article.slug}`}>
          <FadeImage 
            src={article.coverImage} 
            alt={article.title} 
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges on image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
          {article.mood && (
            <span className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-ink shadow-sm backdrop-blur-sm">
              <span>{article.mood.emoji}</span>
              <span className="hidden xs:inline">{article.mood.label}</span>
            </span>
          )}
          {article.weather && (
            <span className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-ink shadow-sm backdrop-blur-sm">
              <span>{article.weather.emoji}</span>
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFav}
          className={cn(
            "absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 shadow-sm",
            article.isFavorite
              ? "bg-rose-500 text-white scale-110"
              : "bg-white/90 text-ink-light hover:text-rose-500 hover:scale-110"
          )}
          title={article.isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
        >
          <Heart className={cn("h-4 w-4", article.isFavorite ? "fill-current" : "")} />
        </button>
      </div>
      
      {/* Card Content */}
      <div className={cn(
        "flex flex-col flex-1",
        featured ? "lg:w-1/2" : ""
      )}>
        {/* Meta Line */}
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-ink-light">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-paper px-2 py-0.5 text-accent font-semibold">
              {article.category || "Günlük"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {article.date}
            </span>
          </div>

          {/* Card Menu (Edit / Delete) */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 text-ink-light hover:text-ink rounded transition-colors"
              title="Seçenekler"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 top-full mt-1 z-20 w-32 rounded-xl bg-white py-1.5 shadow-lg border border-ink/10 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleEdit}
                  className="flex w-full items-center gap-2 px-3 py-2 text-ink hover:bg-paper text-left"
                >
                  <Edit2 className="h-3.5 w-3.5 text-accent" /> Düzenle
                </button>
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 text-left"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Sil
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Title */}
        <Link to={`/post/${article.slug}`} className="group/title block">
          <h2 className={cn(
            "font-serif font-bold leading-snug text-ink group-hover/title:text-accent transition-colors",
            featured ? "text-2xl sm:text-3xl lg:text-4xl mb-3" : "text-xl sm:text-2xl mb-2"
          )}>
            {article.title}
          </h2>
        </Link>
        
        {/* Excerpt */}
        <p className={cn(
          "text-ink-light leading-relaxed font-sans",
          featured ? "text-base sm:text-lg mb-6 line-clamp-4" : "text-sm mb-4 line-clamp-3"
        )}>
          {article.excerpt}
        </p>
        
        {/* Footer info & Read Time */}
        <div className="mt-auto flex items-center justify-between border-t border-ink/5 pt-3">
          <div className="flex items-center gap-2.5">
            <FadeImage 
              src={article.author.avatar} 
              alt={article.author.name} 
              referrerPolicy="no-referrer"
              className="h-7 w-7 rounded-full object-cover border border-accent/20"
            />
            <span className="text-xs font-semibold text-ink">{article.author.name}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-ink-light">
            <Clock className="h-3 w-3" />
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

