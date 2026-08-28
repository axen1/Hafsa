import { motion } from "motion/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { defaultAuthor } from "../data/diaryData";
import { FadeImage } from "../components/FadeImage";
import { Heart, Sparkles, Star, Smile, Palette, BookOpen, Cat, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { useDiary } from "../context/DiaryContext";

export function About() {
  const { setIsWriteModalOpen } = useDiary();

  const favorites = [
    { title: "En Sevdiğim Renkler", value: "Toz pembe, bebek mavisi ve simli altın sarısı 🌸", icon: Palette, color: "text-rose-500 bg-rose-50" },
    { title: "En Sevdiğim Hayvanlar", value: "Yavru kediler, pofuduk tavşanlar ve kelebekler 🐱", icon: Cat, color: "text-amber-500 bg-amber-50" },
    { title: "En Sevdiğim Yiyecekler", value: "Çilekli dondurma, fırından yeni çıkmış kurabiye ve ballı süt 🍦", icon: Heart, color: "text-pink-500 bg-pink-50" },
    { title: "En Sevdiğim Aktiviteler", value: "Bisiklet sürmek, sulu boya yapmak ve masal dinlemek 🎨", icon: Sparkles, color: "text-mint bg-emerald-50" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start"
          >
            {/* Hafsa Avatar Card */}
            <div className="w-full md:w-5/12">
              <div className="rounded-3xl overflow-hidden bg-white p-4 shadow-lg border border-ink/5 sticky top-24">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-ink/5 relative">
                  <FadeImage 
                    src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&h=1000&fit=crop&q=80" 
                    alt="Küçük Hafsa" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/95 backdrop-blur-md p-3 text-center shadow-sm">
                    <span className="font-serif font-bold text-ink text-base">Küçük Hafsa 🌸</span>
                    <p className="text-xs text-accent font-medium">Hayalperest & Günlük Yazarı</p>
                  </div>
                </div>

                <div className="mt-4 p-2 flex items-center justify-around text-center text-xs text-ink-light">
                  <div>
                    <span className="text-lg">🎈</span>
                    <p className="font-semibold text-ink">Neşeli</p>
                  </div>
                  <div className="border-x border-ink/10 px-4">
                    <span className="text-lg">🎨</span>
                    <p className="font-semibold text-ink">Yaratıcı</p>
                  </div>
                  <div>
                    <span className="text-lg">🐱</span>
                    <p className="font-semibold text-ink">Hayvansever</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Story & Biography */}
            <div className="w-full md:w-7/12 flex flex-col">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent mb-4 w-fit">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Merhaba, Ben Hafsa!</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mb-6 tracking-tight">
                Benim Renkli Dünyama <br />
                <span className="italic font-normal text-accent">Hoş Geldiniz! 🌸</span>
              </h1>

              <div className="prose prose-stone prose-lg prose-p:leading-relaxed prose-p:text-ink-light">
                <p className="text-xl font-serif italic text-ink mb-6 leading-snug">
                  "Dünya o kadar güzel ve keşfedilecek o kadar çok şey var ki, hiçbir anı unutmak istemiyorum!"
                </p>
                <p>
                  Merhaba! Ben Hafsa. Bu günlüğü, her gün yaşadığım sevinçleri, parktaki maceralarımı, yaptığım resimleri ve aklıma gelen tatlı masalları kaydetmek için tutuyorum.
                </p>
                <p>
                  Sabahları kuş sesleriyle uyanmayı, sulu boyalarımla rengarenk kağıtlar boyamayı ve yavru kedilerle oyun oynamayı çok seviyorum. Büyüdüğümde bu günlük sayfalarını okuyup çocukluğumun ne kadar güzel geçtiğini hatırlamak en büyük hayalim.
                </p>
              </div>

              {/* Favorites Grid */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favorites.map((fav) => {
                  const Icon = fav.icon;
                  return (
                    <div key={fav.title} className="rounded-2xl bg-white p-4 border border-ink/5 shadow-sm">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`p-2 rounded-lg ${fav.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <h4 className="font-serif font-bold text-sm text-ink">{fav.title}</h4>
                      </div>
                      <p className="text-xs text-ink-light leading-relaxed">{fav.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Call to write */}
              <div className="mt-10 rounded-2xl bg-gradient-to-r from-accent/15 to-rose-soft/20 p-6 border border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif font-bold text-base text-ink">Birlikte Yeni Bir Anı Yazalım mı?</h4>
                  <p className="text-xs text-ink-light">Bugünün güzelliklerini günlüğe dökmek için hemen başla!</p>
                </div>
                <button
                  onClick={() => setIsWriteModalOpen(true)}
                  className="rounded-xl bg-accent px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-accent/90 transition-all shrink-0"
                >
                  Günlük Yaz 🌸
                </button>
              </div>
            </div>
          </motion.div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
