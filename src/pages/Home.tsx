import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Sparkles, PenLine, Heart, Filter, Search, BookOpen, Smile, Star } from "lucide-react";
import { useDiary } from "../context/DiaryContext";
import { ArticleCard } from "../components/ArticleCard";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { categories, moods } from "../data/diaryData";

export function Home() {
  const { entries, setIsWriteModalOpen, setEditingEntry } = useDiary();
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [selectedMood, setSelectedMood] = useState<string>("Tümü");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenWrite = () => {
    setEditingEntry(null);
    setIsWriteModalOpen(true);
  };

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Category filter
      if (selectedCategory !== "Tümü" && entry.category !== selectedCategory) {
        return false;
      }
      // Favorites filter
      if (showOnlyFavorites && !entry.isFavorite) {
        return false;
      }
      // Mood filter
      if (selectedMood !== "Tümü" && entry.mood?.label !== selectedMood) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = entry.title.toLowerCase().includes(q);
        const matchContent = entry.content.toLowerCase().includes(q);
        const matchTags = entry.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchContent && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [entries, selectedCategory, selectedMood, showOnlyFavorites, searchQuery]);

  const featuredArticle = filteredEntries[0];
  const remainingArticles = filteredEntries.slice(1);

  const totalFavorites = entries.filter((e) => e.isFavorite).length;

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />
      
      <main className="flex-1">
        {/* Warm Greeting Hero Section */}
        <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-white via-[#FFF9F5] to-[#FDF4EE] p-8 sm:p-12 lg:p-14 border border-ink/5 shadow-sm relative overflow-hidden">
            {/* Background Decorative Emojis */}
            <div className="absolute -top-6 -right-6 text-7xl sm:text-8xl opacity-15 pointer-events-none select-none">
              🌸
            </div>
            <div className="absolute bottom-4 right-12 text-6xl opacity-10 pointer-events-none select-none">
              ✨
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Küçük Hafsa'nın Özel Anı Defteri</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl md:text-6xl">
                Sevgili Günlük, <br />
                <span className="italic font-normal text-accent">bugün harika bir gündü! 🌸</span>
              </h1>

              {/* Description */}
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-ink-light font-sans">
                Parktaki maceralar, bisiklet turları, yavru kediler, çizdiğim renkli resimler ve içimden geçen tüm güzel hayaller bu sayfalarda.
              </p>

              {/* Action Buttons & Quick Stats */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleOpenWrite}
                  className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-white shadow-lg hover:bg-accent/90 hover:shadow-accent/30 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
                >
                  <PenLine className="h-5 w-5" />
                  <span>Yeni Günlük Sayfası Yaz ✨</span>
                </button>

                <div className="flex items-center gap-4 text-xs font-medium text-ink-light sm:border-l sm:border-ink/10 sm:pl-4">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-accent" />
                    <span><strong>{entries.length}</strong> Anı</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-rose-500 fill-current" />
                    <span><strong>{totalFavorites}</strong> Favori</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 sm:p-5 border border-ink/5 shadow-sm">
            {/* Top row: Category Pills & Favorite Filter */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowOnlyFavorites(false);
                    }}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                      selectedCategory === cat && !showOnlyFavorites
                        ? "bg-accent text-white shadow-sm font-semibold"
                        : "bg-paper text-ink-light hover:bg-paper/80 hover:text-ink"
                    }`}
                  >
                    {cat}
                  </button>
                ))}

                {/* Favorite Toggle */}
                <button
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    showOnlyFavorites
                      ? "bg-rose-500 text-white shadow-sm font-semibold"
                      : "bg-paper text-ink-light hover:text-rose-600"
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${showOnlyFavorites ? "fill-current" : ""}`} />
                  <span>Favorilerim ({totalFavorites})</span>
                </button>
              </div>

              {/* Mood Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-ink-light flex items-center gap-1">
                  <Smile className="h-3.5 w-3.5 text-accent" /> Ruh Hali:
                </span>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  aria-label="Ruh Hali Filtresi"
                  className="rounded-lg border border-ink/10 bg-paper px-2.5 py-1 text-xs text-ink focus:border-accent focus:outline-none"
                >
                  <option value="Tümü">Tümü</option>
                  {moods.map((m) => (
                    <option key={m.label} value={m.label}>
                      {m.emoji} {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search row inside filter */}
            <div className="relative pt-2 border-t border-ink/5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-light" />
              <input
                type="text"
                placeholder="Günlüklerde kelime ara... (örneğin: bisiklet, kedi, resim, kurabiye)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-paper/60 pl-9 pr-4 py-2 text-xs sm:text-sm text-ink placeholder:text-ink/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-light hover:text-ink"
                >
                  Temizle
                </button>
              )}
            </div>
          </div>
        </section>
        
        {/* Entries Grid */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between border-b border-ink/10 pb-3">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-ink flex items-center gap-2">
              <span>📖</span>
              <span>
                {showOnlyFavorites
                  ? "En Sevdiğim Anılar"
                  : selectedCategory !== "Tümü"
                  ? `${selectedCategory} Yazıları`
                  : "Son Yazılan Günlükler"}
              </span>
              <span className="text-xs font-sans font-medium text-ink-light bg-white px-2 py-0.5 rounded-full border border-ink/5">
                {filteredEntries.length} sayfa
              </span>
            </h2>

            {(selectedCategory !== "Tümü" || selectedMood !== "Tümü" || showOnlyFavorites || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory("Tümü");
                  setSelectedMood("Tümü");
                  setShowOnlyFavorites(false);
                  setSearchQuery("");
                }}
                className="text-xs font-semibold text-accent hover:underline"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
          
          {filteredEntries.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center border border-dashed border-ink/20">
              <div className="text-5xl mb-4">🌸</div>
              <h3 className="font-serif text-2xl font-bold text-ink mb-2">
                Burada henüz bir günlük yazısı yok
              </h3>
              <p className="text-sm text-ink-light max-w-md mx-auto mb-6">
                Farklı bir kategori seçebilir veya ilk güzel anını hemen günlüğüne ekleyebilirsin!
              </p>
              <button
                onClick={handleOpenWrite}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-white shadow-md hover:bg-accent/90 transition-all"
              >
                <PenLine className="h-4 w-4" />
                <span>İlk Günlüğünü Yaz 🌸</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {/* Featured Top Entry if no strict search */}
              {featuredArticle && (
                <ArticleCard article={featuredArticle} featured index={0} />
              )}
              
              {/* Remaining Grid */}
              {remainingArticles.length > 0 && (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
                  {remainingArticles.map((article, idx) => (
                    <ArticleCard key={article.id} article={article} index={idx + 1} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
