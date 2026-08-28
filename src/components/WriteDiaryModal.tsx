import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Image as ImageIcon, Smile, Sun, PenTool, Eraser, RotateCcw, Check } from "lucide-react";
import { useDiary } from "../context/DiaryContext";
import { moods, weathers, categories, sampleCovers, DiaryEntry } from "../data/diaryData";

const quickStickers = [
  "🌸", "⭐", "🐱", "🌈", "🚲", "🍦", "🍪", "🎨", "🎈", "🍓", "🦋", "🧚‍♀️", "📚", "💖", "🐾"
];

const drawColors = [
  "#2C2828", "#E07A5F", "#F4ACB7", "#F6BD60", "#84A59D", "#3D405B", "#9B5DE5"
];

export function WriteDiaryModal() {
  const { isWriteModalOpen, setIsWriteModalOpen, addEntry, updateEntry, editingEntry, setEditingEntry } = useDiary();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Maceralarım");
  const [selectedMood, setSelectedMood] = useState(moods[0]);
  const [selectedWeather, setSelectedWeather] = useState(weathers[0]);
  const [coverImage, setCoverImage] = useState(sampleCovers[0].url);
  const [tagsInput, setTagsInput] = useState("");
  const [quoteText, setQuoteText] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "drawing" | "cover">("write");

  // Drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState(drawColors[1]);
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [drawingDataUrl, setDrawingDataUrl] = useState<string | undefined>(undefined);

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (editingEntry) {
      setTitle(editingEntry.title);
      setContent(editingEntry.content);
      setCategory(editingEntry.category || "Maceralarım");
      setSelectedMood(editingEntry.mood || moods[0]);
      setSelectedWeather(editingEntry.weather || weathers[0]);
      setCoverImage(editingEntry.coverImage || sampleCovers[0].url);
      setTagsInput((editingEntry.tags || []).join(", "));
      setQuoteText(editingEntry.quote?.text || "");
      if (editingEntry.drawing) {
        setDrawingDataUrl(editingEntry.drawing);
        setHasDrawing(true);
      }
    } else {
      resetForm();
    }
  }, [editingEntry, isWriteModalOpen]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("Maceralarım");
    setSelectedMood(moods[0]);
    setSelectedWeather(weathers[0]);
    setCoverImage(sampleCovers[Math.floor(Math.random() * sampleCovers.length)].url);
    setTagsInput("");
    setQuoteText("");
    setDrawingDataUrl(undefined);
    setHasDrawing(false);
    clearCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasDrawing(false);
    setDrawingDataUrl(undefined);
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = drawColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawing(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && hasDrawing) {
      setDrawingDataUrl(canvas.toDataURL("image/png"));
    }
  };

  const handleInsertSticker = (sticker: string) => {
    setContent((prev) => prev + " " + sticker + " ");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const excerpt = content.slice(0, 160).replace(/(\r\n|\n|\r)/gm, " ") + (content.length > 160 ? "..." : "");

    const payload = {
      title: title.trim(),
      content: content.trim() || "Bugün çok güzel bir gündü! 🌸",
      excerpt: excerpt || "Hafsa'nın günlük anısı...",
      category: category === "Tümü" ? "Maceralarım" : category,
      mood: selectedMood,
      weather: selectedWeather,
      coverImage: coverImage || sampleCovers[0].url,
      tags: tags.length > 0 ? tags : [category],
      drawing: drawingDataUrl,
      quote: quoteText.trim() ? { text: quoteText.trim(), author: "Hafsa" } : undefined
    };

    if (editingEntry) {
      updateEntry(editingEntry.id, payload);
    } else {
      addEntry(payload);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsWriteModalOpen(false);
      setEditingEntry(null);
      resetForm();
    }, 900);
  };

  const handleClose = () => {
    setIsWriteModalOpen(false);
    setEditingEntry(null);
  };

  return (
    <AnimatePresence>
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-paper shadow-2xl border border-ink/10 flex flex-col max-h-[92vh]"
          >
            {/* Header / Tabs */}
            <div className="flex items-center justify-between border-b border-ink/10 bg-white/60 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-ink">
                    {editingEntry ? "Günlüğü Düzenle" : "Yeni Günlük Sayfası"}
                  </h2>
                  <p className="text-xs text-ink-light">Hafsa'nın özel anı defteri 🌸</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Navigation Tabs */}
                <div className="flex bg-paper rounded-lg p-1 border border-ink/5 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "write"
                        ? "bg-white text-ink shadow-sm font-semibold"
                        : "text-ink-light hover:text-ink"
                    }`}
                  >
                    📝 Yazı
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("drawing")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "drawing"
                        ? "bg-white text-ink shadow-sm font-semibold"
                        : "text-ink-light hover:text-ink"
                    }`}
                  >
                    🎨 Çizim
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("cover")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "cover"
                        ? "bg-white text-ink shadow-sm font-semibold"
                        : "text-ink-light hover:text-ink"
                    }`}
                  >
                    🖼️ Kapak
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full p-2 text-ink-light hover:bg-ink/5 hover:text-ink transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* Mood & Weather Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/80 p-4 rounded-xl border border-ink/5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-ink-light mb-2 flex items-center gap-1.5">
                    <Smile className="h-3.5 w-3.5 text-accent" /> Ruh Halim
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {moods.map((m) => (
                      <button
                        type="button"
                        key={m.label}
                        onClick={() => setSelectedMood(m)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all ${
                          selectedMood.label === m.label
                            ? "bg-accent text-white font-medium shadow-sm scale-105"
                            : "bg-paper text-ink-light hover:bg-paper/80"
                        }`}
                      >
                        <span>{m.emoji}</span>
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-ink-light mb-2 flex items-center gap-1.5">
                    <Sun className="h-3.5 w-3.5 text-sunny" /> Hava Durumu
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {weathers.map((w) => (
                      <button
                        type="button"
                        key={w.label}
                        onClick={() => setSelectedWeather(w)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all ${
                          selectedWeather.label === w.label
                            ? "bg-sunny/30 border border-sunny text-ink font-medium shadow-sm scale-105"
                            : "bg-paper text-ink-light hover:bg-paper/80"
                        }`}
                      >
                        <span>{w.emoji}</span>
                        <span>{w.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-ink-light mb-1.5 block">
                    Günün Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Bugün Parkta Yeni Bir Arkadaş Edindim 🌸"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 font-serif text-lg text-ink placeholder:text-ink/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-ink-light mb-1.5 block">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-ink/15 bg-white px-3 py-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                  >
                    {categories.filter((c) => c !== "Tümü").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TAB 1: Writing View */}
              {activeTab === "write" && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-ink-light">
                      Sevgili Günlük... (Yazın)
                    </label>

                    {/* Quick Stickers Bar */}
                    <div className="flex items-center gap-1 overflow-x-auto py-1">
                      <span className="text-xs text-ink-light mr-1">Çıkartma Ekle:</span>
                      {quickStickers.slice(0, 8).map((sticker) => (
                        <button
                          type="button"
                          key={sticker}
                          onClick={() => handleInsertSticker(sticker)}
                          className="hover:scale-125 transition-transform text-base px-1"
                          title="Yazıya ekle"
                        >
                          {sticker}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative rounded-2xl border border-ink/10 shadow-inner bg-white overflow-hidden">
                    <textarea
                      rows={8}
                      placeholder="Sevgili Günlük, bugün çok eğlenceli geçti..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="lined-paper w-full resize-none p-6 font-sans text-base text-ink placeholder:text-ink/30 focus:outline-none"
                    />
                  </div>

                  {/* Extra: Quote / Hafsa'nın Sözü */}
                  <div className="mt-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-ink-light mb-1 block">
                      Günün Tatlı Sözü (İsteğe Bağlı)
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Gülümsemek dünyadaki en güzel renktir ✨"
                      value={quoteText}
                      onChange={(e) => setQuoteText(e.target.value)}
                      className="w-full rounded-xl border border-ink/10 bg-white/70 px-4 py-2 text-sm text-ink italic placeholder:text-ink/30 focus:border-accent focus:outline-none"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-ink-light mb-1 block">
                      Etiketler (Virgülle ayırın)
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Oyun, Kediler, Park, Eğlence"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full rounded-xl border border-ink/10 bg-white/70 px-4 py-2 text-sm text-ink placeholder:text-ink/30 focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Canvas Drawing View */}
              {activeTab === "drawing" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-ink/10">
                    {/* Colors */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-ink-light">Renk:</span>
                      {drawColors.map((color) => (
                        <button
                          type="button"
                          key={color}
                          onClick={() => {
                            setDrawColor(color);
                            setIsEraser(false);
                          }}
                          style={{ backgroundColor: color }}
                          className={`h-7 w-7 rounded-full transition-transform ${
                            drawColor === color && !isEraser
                              ? "ring-2 ring-accent ring-offset-2 scale-110"
                              : "hover:scale-105"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Tools */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEraser(false)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          !isEraser ? "bg-accent text-white" : "bg-paper text-ink-light"
                        }`}
                      >
                        <PenTool className="h-3.5 w-3.5" /> Kalem
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEraser(true)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isEraser ? "bg-ink text-white" : "bg-paper text-ink-light"
                        }`}
                      >
                        <Eraser className="h-3.5 w-3.5" /> Silgi
                      </button>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-paper text-ink-light hover:text-red-500 transition-colors"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Temizle
                      </button>
                    </div>

                    {/* Brush Size */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-light">Kalınlık:</span>
                      <input
                        type="range"
                        min="2"
                        max="16"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-20 accent-accent cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Canvas Pad */}
                  <div className="relative rounded-2xl border-2 border-dashed border-accent/40 bg-white p-2 shadow-inner flex flex-col items-center">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={320}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full max-w-[600px] h-[260px] sm:h-[320px] rounded-xl bg-[#FFFDF9] cursor-crosshair touch-none"
                    />
                    <p className="text-xs text-ink-light mt-2">
                      🎨 Parmak veya fare ile çizim yapıp günlüğüne ekleyebilirsin!
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: Cover Photo Selector */}
              {activeTab === "cover" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-ink-light mb-2 block">
                      Hazır Sevimli Kapak Resimleri
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {sampleCovers.map((item) => (
                        <button
                          type="button"
                          key={item.url}
                          onClick={() => setCoverImage(item.url)}
                          className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                            coverImage === item.url
                              ? "border-accent ring-2 ring-accent/30 scale-[1.02]"
                              : "border-transparent opacity-80 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.label}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                            <span className="text-white text-xs font-medium drop-shadow">
                              {item.label}
                            </span>
                          </div>
                          {coverImage === item.url && (
                            <div className="absolute top-2 right-2 bg-accent text-white p-1 rounded-full shadow">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-ink-light mb-1.5 block">
                      Veya Özel Görsel URL'si Yapıştır
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-2 flex items-center justify-between border-t border-ink/10 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-ink-light hover:bg-ink/5 hover:text-ink transition-colors"
                >
                  Vazgeç
                </button>

                <button
                  type="submit"
                  disabled={savedSuccess}
                  className={`flex items-center gap-2 rounded-xl px-8 py-3 font-semibold text-white shadow-lg transition-all ${
                    savedSuccess
                      ? "bg-mint scale-95"
                      : "bg-accent hover:bg-accent/90 hover:shadow-accent/30 active:scale-95"
                  }`}
                >
                  {savedSuccess ? (
                    <>
                      <Check className="h-5 w-5" /> Günlüğe Eklendi! ✨
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      {editingEntry ? "Güncellemeyi Kaydet" : "Günlüğüme Kaydet 🌸"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
