import type { Author } from "../data/diaryData";
import { Sparkles, Heart } from "lucide-react";

interface AuthorInfoProps {
  author: Author;
}

export function AuthorInfo({ author }: AuthorInfoProps) {
  return (
    <div className="mt-16 rounded-2xl bg-white p-6 sm:p-8 border border-ink/5 shadow-sm">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6 text-center sm:text-left">
        <div className="relative">
          <img 
            src={author.avatar} 
            alt={author.name} 
            referrerPolicy="no-referrer"
            className="h-20 w-20 rounded-full object-cover border-2 border-accent/40 shadow-sm"
          />
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white text-xs">
            🌸
          </span>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h3 className="font-serif text-xl font-bold tracking-tight text-ink">
              {author.name}
            </h3>
            <span className="rounded-full bg-paper px-2.5 py-0.5 text-xs font-semibold text-accent">
              Küçük Günlük Yazarı
            </span>
          </div>
          <p className="mt-2 text-sm text-ink-light leading-relaxed max-w-xl">
            {author.bio}
          </p>
          <div className="mt-3 flex items-center justify-center sm:justify-start gap-3 text-xs font-medium text-accent">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Hayal Et
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" /> Sevgiyle Yaz
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

