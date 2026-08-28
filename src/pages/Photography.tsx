import { motion } from "motion/react";
import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Lightbox } from "../components/Lightbox";
import { FadeImage } from "../components/FadeImage";
import { Sparkles, Camera, Palette } from "lucide-react";

const memoryPhotos = [
  { 
    src: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1200&h=800&fit=crop", 
    width: 1200, 
    height: 800, 
    alt: "Bisikletimle parkta", 
    caption: "Pembe bisikletimle ilk tek başına sürüşüm 🚲" 
  },
  { 
    src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&h=1200&fit=crop", 
    width: 1000, 
    height: 1200, 
    alt: "Minik Pamuk kedi", 
    caption: "Parkta süt verdiğimiz minik Pamuk kedi 🐱" 
  },
  { 
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&h=800&fit=crop", 
    width: 1200, 
    height: 800, 
    alt: "Sulu boya resimlerim", 
    caption: "Gökkuşağı ve masal evleri çizdiğim gün 🎨" 
  },
  { 
    src: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&h=900&fit=crop", 
    width: 1200, 
    height: 900, 
    alt: "Kurabiye günü", 
    caption: "Annemle pişirdiğimiz sıcacık çikolatalı kurabiyeler 🍪" 
  },
  { 
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&h=800&fit=crop", 
    width: 1200, 
    height: 800, 
    alt: "Güneşli sahil ve deniz kabukları", 
    caption: "Sahilde topladığım renkli deniz kabukları 🏖️" 
  },
  { 
    src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&h=1200&fit=crop", 
    width: 1000, 
    height: 1200, 
    alt: "Masal kitaplarım", 
    caption: "Uykudan önce okuduğum sihirli masal kitabı 📖" 
  },
  { 
    src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1200&h=800&fit=crop", 
    width: 1200, 
    height: 800, 
    alt: "Kır çiçekleri", 
    caption: "Bahçeden annem için topladığım papatyalar 🌼" 
  },
  { 
    src: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&h=800&fit=crop", 
    width: 1200, 
    height: 800, 
    alt: "Yıldızlı gökyüzü", 
    caption: "Balkondan dilek tuttuğum yıldızlı gece ✨" 
  }
];

export function Photography() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 text-center sm:text-left max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent mb-4">
              <Camera className="h-3.5 w-3.5" />
              <span>Anı Albümü</span>
            </div>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl md:text-6xl">
              Fotoğraflarım & Çizimlerim 🌸
            </h1>
            <p className="mt-4 text-base sm:text-lg text-ink-light">
              Gezdiğim yerlerden, parktaki neşeli anlardan ve sulu boya kağıtlarımdan küçük kareler.
            </p>
          </motion.div>

          {/* Grid of memory pictures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memoryPhotos.map((photo, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "60px" }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white p-3 border border-ink/5 shadow-sm hover:shadow-xl transition-all cursor-zoom-in"
                onClick={() => setSelectedIndex(idx)}
              >
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-paper relative">
                  <FadeImage
                    src={photo.src}
                    alt={photo.alt}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-xs font-medium drop-shadow">
                      Büyütmek için tıkla 🔍
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-serif font-semibold text-ink text-sm sm:text-base line-clamp-1">
                    {photo.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      <Lightbox 
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        src={selectedIndex !== null ? memoryPhotos[selectedIndex].src : ""}
        alt={selectedIndex !== null ? memoryPhotos[selectedIndex].alt : ""}
        caption={selectedIndex !== null ? memoryPhotos[selectedIndex].caption : ""}
      />
    </div>
  );
}
