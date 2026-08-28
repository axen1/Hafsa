import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { useState, useEffect } from "react";
import { 
  Heart, Calendar, Clock, ArrowLeft, ArrowRight, Share2, 
  Volume2, VolumeX, Printer, Edit2, Trash2, Sparkles, Smile, Sun, Check, Cloud, CloudUpload 
} from "lucide-react";
import { useDiary } from "../context/DiaryContext";
import { useGoogleDrive } from "../context/GoogleDriveContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AuthorInfo } from "../components/AuthorInfo";
import { QuoteEmbed } from "../components/QuoteEmbed";
import { ImageEmbed } from "../components/ImageEmbed";
import { FadeImage } from "../components/FadeImage";

export function Post() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { entries, toggleFavorite, addReaction, deleteEntry, setEditingEntry, setIsWriteModalOpen } = useDiary();
  const { exportEntry, isSyncing, setIsDriveModalOpen } = useGoogleDrive();

  const articleIndex = entries.findIndex((a) => a.slug === slug);
  const article = entries[articleIndex];

  const prevArticle = articleIndex > 0 ? entries[articleIndex - 1] : null;
  const nextArticle = articleIndex >= 0 && articleIndex < entries.length - 1 ? entries[articleIndex + 1] : null;

  // Parallax scroll effects
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.2]);

  // Audio Speech Reader State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [driveExportStatus, setDriveExportStatus] = useState<string | null>(null);

  // Stop speech when navigating away
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [slug]);

  if (!article) {
    return <Navigate to="/" replace />;
  }

  const handleExportToDrive = async () => {
    setDriveExportStatus("Kaydediliyor...");
    const res = await exportEntry(article);
    if (res.success) {
      setDriveExportStatus("Drive'a Kaydedildi! ✨");
      setTimeout(() => setDriveExportStatus(null), 3500);
    } else {
      setDriveExportStatus("Drive Hatası");
      setTimeout(() => setDriveExportStatus(null), 3000);
    }
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert("Tarayıcınız sesli okuma özelliğini desteklemiyor.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToRead = `${article.title}. ${article.content}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = "tr-TR";
      utterance.rate = 0.95; // child friendly friendly pace

      utterance.onend = () => {
        setIsPlayingAudio(false);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleEdit = () => {
    setEditingEntry(article);
    setIsWriteModalOpen(true);
  };

  const handleDelete = () => {
    if (window.confirm(`"${article.title}" başlıklı günlük yazısını silmek istiyor musunuz?`)) {
      deleteEntry(article.id);
      navigate("/");
    }
  };

  // Reactions
  const reactions = article.reactions || { "❤️": 5, "🌸": 3, "✨": 4, "🎉": 2 };

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />
      
      <main className="flex-1">
        {/* Back Link & Quick Actions Bar */}
        <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-ink-light hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tüm Günlüklere Dön</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {/* Google Drive Export */}
            <button
              onClick={handleExportToDrive}
              disabled={isSyncing}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all border ${
                driveExportStatus
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
              }`}
              title="Bu yazıyı Google Drive'a kaydet"
            >
              <CloudUpload className="h-3.5 w-3.5" />
              <span>{driveExportStatus || "Drive'a Kaydet"}</span>
            </button>

            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                isPlayingAudio 
                  ? "bg-accent text-white animate-pulse" 
                  : "bg-white text-ink hover:bg-accent/10 hover:text-accent border border-ink/10"
              }`}
              title="Yazıyı Sesli Dinle"
            >
              {isPlayingAudio ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              <span>{isPlayingAudio ? "Durdur" : "Sesli Dinle 🔊"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-paper border border-ink/10 transition-colors"
              title="Yazdır / Hatıra Sayfası"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Yazdır</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-paper border border-ink/10 transition-colors"
              title="Bağlantıyı Kopyala"
            >
              {isCopied ? <Check className="h-3.5 w-3.5 text-mint" /> : <Share2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isCopied ? "Kopyalandı" : "Paylaş"}</span>
            </button>

            <button
              onClick={handleEdit}
              className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink hover:text-accent border border-ink/10 transition-colors"
              title="Günlüğü Düzenle"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Düzenle</span>
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 border border-ink/10 transition-colors"
              title="Günlüğü Sil"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Hero Cover Banner */}
        <div className="relative mx-auto max-w-4xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl bg-ink shadow-lg">
            <motion.div 
              style={{ y, opacity }}
              className="absolute inset-0"
            >
              <FadeImage 
                src={article.coverImage} 
                alt={article.title} 
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover opacity-80"
              />
            </motion.div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Badges on hero */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {article.mood && (
                <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow backdrop-blur-md">
                  <span>{article.mood.emoji}</span>
                  <span>{article.mood.label}</span>
                </span>
              )}
              {article.weather && (
                <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow backdrop-blur-md">
                  <span>{article.weather.emoji}</span>
                  <span>{article.weather.label}</span>
                </span>
              )}
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow">
                {article.category || "Günlük"}
              </span>
            </div>

            {/* Favorite toggle on top right */}
            <button
              onClick={() => toggleFavorite(article.id)}
              className={`absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-md ${
                article.isFavorite ? "bg-rose-500 text-white scale-110" : "bg-white/90 text-ink hover:text-rose-500"
              }`}
              title={article.isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
            >
              <Heart className={`h-5 w-5 ${article.isFavorite ? "fill-current" : ""}`} />
            </button>

            {/* Title on Hero bottom */}
            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10">
              <div className="mb-2 flex items-center gap-3 text-xs font-medium text-white/80">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {article.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {article.readTime}
                </span>
              </div>
              
              <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white drop-shadow-md">
                {article.title}
              </h1>
            </div>
          </div>
        </div>
        
        {/* Main Diary Entry Paper Body */}
        <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-6 sm:p-12 shadow-md border border-ink/5 relative overflow-hidden">
            {/* Top decorative bookmark sticker */}
            <div className="absolute top-0 right-12 w-8 h-10 bg-accent rounded-b-md shadow-sm opacity-90 flex items-end justify-center pb-1 text-white text-xs select-none">
              🌸
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Excerpt Lead */}
              {article.excerpt && (
                <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-paper/70 border-l-4 border-accent text-ink font-serif text-lg sm:text-xl italic leading-relaxed">
                  "{article.excerpt}"
                </div>
              )}

              {/* Hand-drawn Sketch / Canvas drawing if present */}
              {article.drawing && (
                <div className="my-8 flex flex-col items-center">
                  <div className="rounded-2xl border-2 border-dashed border-accent/40 bg-white p-4 shadow-sm max-w-md w-full">
                    <p className="text-xs font-semibold text-accent mb-2 text-center uppercase tracking-wider">
                      🎨 Hafsa'nın Bu Günlük İçin Çizimi
                    </p>
                    <img 
                      src={article.drawing} 
                      alt="Hafsa'nın Çizimi" 
                      className="w-full h-auto rounded-xl object-contain bg-[#FFFDF9]"
                    />
                  </div>
                </div>
              )}

              {/* Diary Text Content formatted with paragraphs */}
              <div className="prose prose-lg prose-stone max-w-none text-ink font-sans leading-loose text-base sm:text-lg">
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 whitespace-pre-line text-ink leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Optional Quote Block */}
              {article.quote && (
                <div className="my-10">
                  <QuoteEmbed 
                    quote={article.quote.text}
                    author={article.quote.author || "Hafsa"}
                  />
                </div>
              )}

              {/* Optional Gallery Images inside Post */}
              {article.galleryImages && article.galleryImages.length > 0 && (
                <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {article.galleryImages.map((img, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden bg-paper border border-ink/5">
                      <img src={img.src} alt={img.alt} className="w-full h-48 object-cover" />
                      {img.caption && (
                        <p className="p-3 text-xs text-ink-light text-center italic">{img.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-ink/10 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-light">Etiketler:</span>
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-accent border border-accent/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Interactive Emoji Reactions */}
              <div className="mt-10 rounded-2xl bg-paper/60 p-6 border border-ink/5">
                <h4 className="font-serif text-base font-semibold text-ink mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span>Bu anıya bir sevgi bırak:</span>
                </h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    { emoji: "❤️", label: "Çok Sevdim" },
                    { emoji: "🌸", label: "Çok Tatlı" },
                    { emoji: "✨", label: "Harika Gün" },
                    { emoji: "🎉", label: "Kutlarım" },
                    { emoji: "🍪", label: "Leziz" },
                    { emoji: "🐱", label: "Miyav" }
                  ].map((item) => {
                    const count = reactions[item.emoji] || 0;
                    return (
                      <button
                        key={item.emoji}
                        onClick={() => addReaction(article.id, item.emoji)}
                        className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-sm font-medium text-ink shadow-sm hover:scale-110 active:scale-95 transition-all border border-ink/5 hover:border-accent"
                      >
                        <span className="text-lg">{item.emoji}</span>
                        <span className="text-xs font-bold text-accent">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Author Info */}
              <AuthorInfo author={article.author} />
            </motion.div>
          </div>

          {/* Book Page Navigation (Previous & Next Diary Entry) */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevArticle ? (
              <Link 
                to={`/post/${prevArticle.slug}`}
                className="group flex flex-col p-5 rounded-2xl bg-white border border-ink/5 hover:border-accent/30 shadow-sm transition-all text-left"
              >
                <span className="flex items-center gap-1 text-xs font-semibold text-accent mb-1">
                  <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                  <span>Önceki Günlük Sayfası</span>
                </span>
                <span className="font-serif text-base font-bold text-ink group-hover:text-accent transition-colors line-clamp-1">
                  {prevArticle.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextArticle ? (
              <Link 
                to={`/post/${nextArticle.slug}`}
                className="group flex flex-col p-5 rounded-2xl bg-white border border-ink/5 hover:border-accent/30 shadow-sm transition-all text-right sm:text-right"
              >
                <span className="flex items-center justify-end gap-1 text-xs font-semibold text-accent mb-1">
                  <span>Sonraki Günlük Sayfası</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="font-serif text-base font-bold text-ink group-hover:text-accent transition-colors line-clamp-1">
                  {nextArticle.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
