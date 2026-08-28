export interface Author {
  name: string;
  avatar: string;
  bio: string;
  role: string;
}

export interface Mood {
  emoji: string;
  label: string;
}

export interface Weather {
  emoji: string;
  label: string;
}

export interface DiaryEntry {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  readTime: string;
  author: Author;
  tags: string[];
  category: string;
  mood: Mood;
  weather: Weather;
  isFavorite?: boolean;
  drawing?: string; // base64 or image url
  stickers?: string[];
  reactions?: { [key: string]: number };
  quote?: { text: string; author?: string };
  galleryImages?: { src: string; alt: string; caption?: string }[];
}

export const defaultAuthor: Author = {
  name: "Küçük Hafsa",
  avatar: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=500&h=500&fit=crop&q=80",
  bio: "Renkli boya kalemlerini, yavru kedileri, çilekli dondurmayı ve parkta koşmayı çok seven minik bir hayalperest 🌸",
  role: "Günlük Yazarı"
};

export const sampleCovers = [
  { label: "Bisiklet & Park", url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&h=800&fit=crop&q=80" },
  { label: "Sevimli Kedi", url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&h=800&fit=crop&q=80" },
  { label: "Renkli Boyalar", url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=800&fit=crop&q=80" },
  { label: "Kurabiye & Tatlı", url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1200&h=800&fit=crop&q=80" },
  { label: "Yıldızlı Gece", url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&h=800&fit=crop&q=80" },
  { label: "Masal Kitapları", url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=800&fit=crop&q=80" },
  { label: "Doğa & Çiçekler", url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=800&fit=crop&q=80" },
  { label: "Uçan Balonlar", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop&q=80" }
];

export const moods: Mood[] = [
  { emoji: "🌟", label: "Çok Mutlu" },
  { emoji: "😊", label: "Neşeli" },
  { emoji: "🎨", label: "Yaratıcı" },
  { emoji: "🐱", label: "Oyuncu" },
  { emoji: "🌸", label: "Huzurlu" },
  { emoji: "🎉", label: "Heyecanlı" },
  { emoji: "😋", label: "Tatlı Gün" },
  { emoji: "🔍", label: "Meraklı" },
  { emoji: "😴", label: "Tatlı Yorgun" }
];

export const weathers: Weather[] = [
  { emoji: "☀️", label: "Güneşli" },
  { emoji: "🌤️", label: "Parçalı Bulutlu" },
  { emoji: "🌈", label: "Gökkuşağı" },
  { emoji: "🌧️", label: "Yağmurlu" },
  { emoji: "🍃", label: "Rüzgarlı" },
  { emoji: "❄️", label: "Karlı" },
  { emoji: "🌙", label: "Yıldızlı Gece" }
];

export const categories = [
  "Tümü",
  "Maceralarım",
  "Hayvan Dostlarım",
  "Resimlerim & Çizimlerim",
  "Ailemle Günler",
  "Masal Dünyam",
  "Hayallerim"
];

export const initialEntries: DiaryEntry[] = [
  {
    id: "entry-1",
    slug: "ilk-kez-iki-tekerlekli-bisiklete-bindim",
    title: "İlk Kez İki Tekerlekli Bisiklete Bindim! 🚲",
    excerpt: "Bugün babamla parka gittik ve yardımcı tekerlekleri çıkardık. Biraz korkmuştum ama başardım!",
    content: `Sevgili Günlük,

Bugün hayatımın en heyecanlı günlerinden biriydi! Sabah kahvaltıdan hemen sonra babamla bahçeye indik. Pembe bisikletimin arkasındaki küçük yan tekerlekleri tornavidayla söktük. 

İlk başta bisiklet çok sallandı, az kalsın düşecektim. Babam arkamdan tutuyordu ve 'Pedalları çevirmeye devam et Hafsa, rüzgarı hisset!' dedi. 

Derin bir nefes aldım ve gözlerimi ileriye dikip pedallara var gücümle bastım. Birkaç saniye sonra arkama baktım; babam beni bırakmıştı ve ben tek başıma sürüyordum! Sanki uçuyor gibiydim. Saçlarım rüzgarda dalgalandı ve kocaman kahkahalar attım.

Parktaki çimlerin etrafında üç tur attım. Annem de balkondan bana el salladı ve alkışladı. Artık kocaman bir kız gibi hissediyorum! Yarın tekrar bisiklete binmek için sabırsızlanıyorum.`,
    coverImage: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&h=800&fit=crop&q=80",
    date: "26 Ağustos 2024",
    readTime: "2 dk okuma",
    author: defaultAuthor,
    tags: ["Bisiklet", "Park", "Büyük Başarı"],
    category: "Maceralarım",
    mood: { emoji: "🌟", label: "Çok Mutlu" },
    weather: { emoji: "☀️", label: "Güneşli" },
    isFavorite: true,
    quote: {
      text: "Korkularını arkanda bıraktığında gökyüzünde kanat çırpmak kadar hafiflersin!",
      author: "Hafsa'nın Günlük Notu"
    },
    reactions: { "❤️": 14, "🎉": 8, "✨": 12 },
    galleryImages: [
      { src: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop&q=80", alt: "Bisikletim", caption: "Pembe bisikletimle park yolu" },
      { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80", alt: "Güneşli gökyüzü", caption: "Bugünün ılık havası" }
    ]
  },
  {
    id: "entry-2",
    slug: "parktaki-minik-pamuk-kedicik",
    title: "Parktaki Minik Pamuk Kedicikle Tanıştım 🐱",
    excerpt: "Çınar ağacının altında beyaz tüylü, mavi gözlü minik bir kedi yavrusu bulduk. Ona süt ve sevgi verdik.",
    content: `Sevgili Günlük,

Bugün öğleden sonra annemle markete giderken parkın köşesindeki büyük çınar ağacının altından incecik bir 'Miyav!' sesi duyduk.

Hemen sesin geldiği yere koştum. Çalıların arasına saklanmış, pamuk gibi bembeyaz ve gözleri deniz gibi masmavi olan minicik bir yavru kedi vardı! Çok korkmuş gibi titriyordu.

Elimi yavaşça uzattım ve 'Korkma minik dostum' dedim. Burnunu parmağıma dokundurdu ve gırıldamaya başladı! Annemle yakındaki bakkaldan küçük bir kap süt ve kedi maması aldık. Karnını o kadar tatlı doyurdu ki bıyıklarına süt bulaştı.

Ona 'Pamuk' adını koydum. Karnı doyunca ayakkabımın bağcıklarıyla oynamaya başladı. Parkın görevlisi amca da Pamuk'a küçük bir kulübe yapacağına söz verdi. Yarın okul çıkışında onu tekrar ziyaret edeceğim!`,
    coverImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&h=800&fit=crop&q=80",
    date: "23 Ağustos 2024",
    readTime: "3 dk okuma",
    author: defaultAuthor,
    tags: ["Kediler", "Hayvan Sevgisi", "Pamuk"],
    category: "Hayvan Dostlarım",
    mood: { emoji: "💖", label: "Sevgi Dolu" },
    weather: { emoji: "🌤️", label: "Parçalı Bulutlu" },
    isFavorite: true,
    quote: {
      text: "Küçük bir hayvanın kalbine dokunmak, dünyadaki en sıcak sarılma gibidir.",
      author: "Hafsa"
    },
    reactions: { "❤️": 22, "🐱": 18, "🌸": 15 }
  },
  {
    id: "entry-3",
    slug: "gokkusagi-ve-renkli-cicekler-cizdim",
    title: "Gökkuşağı ve Uçan Balonlar Çizdim 🎨",
    excerpt: "Sulu boyalarımı masaya yaydım. Gökyüzünü mora, bulutları pembeye boyayarak sihirli bir dünya yaptım.",
    content: `Sevgili Günlük,

Bugün dışarıda tatlı bir yaz yağmuru yağıyordu. Cam kenarına oturdum ve yağmur damlalarının yarışını izledim. Sonra birden aklıma harika bir fikir geldi: Resim defterimi ve sulu boyalarımı çıkardım!

Büyük beyaz kağıda dev bir gökkuşağı çizdim. Ama bildiğimiz gökkuşaklarından farklıydı; içinde parıltılı simler, bulutların üzerinde yürüyen sevimli tavşanlar ve göğe doğru yükselen renkli sıcak hava balonları vardı.

Gökkuşağının tam ortasına küçük bir ev çizdim; çatısı çilek şeklinde, pencereleri ise kalp gibiydi. Annem resmi görünce çok beğendi ve buzdolabının kapağına astı!

Renklerle oynamayı çok seviyorum. Fırçayı suya batırıp kağıda dokundurduğumda sanki kendi sihirli masal dünyamı kuruyorum.`,
    coverImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=800&fit=crop&q=80",
    date: "19 Ağustos 2024",
    readTime: "2 dk okuma",
    author: defaultAuthor,
    tags: ["Resim", "Sulu Boya", "Hayal Gücü"],
    category: "Resimlerim & Çizimlerim",
    mood: { emoji: "🎨", label: "Yaratıcı" },
    weather: { emoji: "🌈", label: "Gökkuşağı" },
    isFavorite: false,
    reactions: { "🎨": 16, "✨": 10, "❤️": 9 }
  },
  {
    id: "entry-4",
    slug: "annemle-cikolatali-kurabiye-pisirdik",
    title: "Annemle Çikolatalı Fındıklı Kurabiye Pişirdik 🍪",
    excerpt: "Mutfak un koktu, burnuma un bulaştı! Fırından yeni çıkan sıcak kurabiyelerin tadı bir harikaydı.",
    content: `Sevgili Günlük,

Akşamüstü mutfakta anneme yardım ettim. Üzerime çiçekli mutfak önlüğümü taktım ve kurabiye şefi oldum!

Geniş cam kaseye tereyağı, esmer şeker ve vanilyayı koyup mikserle çırptık. Ben içine kocaman damla çikolataları ve ezilmiş fındıkları döktüm. Hamura ellerimle yuvarlak toplar yapıp fırın tepsisine dizdim. Hamur yoğururken burnuma un bulaşmış, annem bana bakıp çok güldü.

Fırının kapağını kapattıktan 10 dakika sonra bütün eve mis gibi çikolata ve vanilya kokusu yayıldı. 

Fırından çıktıklarında ılık bir bardak ballı sütle iki tane kurabiye yedim. Çikolataları ağzımda eriyordu. Babam işten gelince ona da ikram ettim, 'Dünyanın en lezzetli kurabiyesini Hafsa Şef yapmış!' dedi. Gururdan yanaklarım kızardı!`,
    coverImage: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1200&h=800&fit=crop&q=80",
    date: "15 Ağustos 2024",
    readTime: "2 dk okuma",
    author: defaultAuthor,
    tags: ["Mutfak", "Kurabiye", "Aile"],
    category: "Ailemle Günler",
    mood: { emoji: "😋", label: "Tatlı Gün" },
    weather: { emoji: "🍃", label: "Rüzgarlı" },
    isFavorite: true,
    reactions: { "😋": 19, "🍪": 25, "❤️": 14 }
  },
  {
    id: "entry-5",
    slug: "gece-balkondan-kayan-yildizi-gordum",
    title: "Gece Balkondan Kayan Yıldızı Gördüm ✨",
    excerpt: "Gökyüzü binlerce pırlanta gibiydi. Tam uyumadan önce parıldayan bir çizgi aktı ve bir dilek tuttum.",
    content: `Sevgili Günlük,

Dün gece hava çok açıktı. Yatmadan önce babamla balkona çıktık, üzerimize yumuşacık bir battaniye örttük ve gökyüzündeki yıldızları seyrettik.

Babam bana Büyük Ayı ve Küçük Ayı takım yıldızlarını gösterdi. Yıldızların sanki gökyüzüne serpiştirilmiş gümüş tozlar gibi parıldadığını düşündüm. 

Tam o sırada, gökyüzünün doğu tarafından minik, ışıl ışıl bir çizgi hızla aşağıya doğru süzüldü! 'Bak Hafsa, bir yıldız kaydı!' dedi babam. Hemen gözlerimi sımsıkı kapattım ve kalbimden bir dilek tuttum: 'Tüm sokak hayvanları kışın sıcak yuvalar bulsun ve ailemle hep çok mutlu olalım.'

Dileğimin gerçekleşeceğini biliyorum. Yıldızlar gökyüzünün masal perileri gibidir.`,
    coverImage: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&h=800&fit=crop&q=80",
    date: "10 Ağustos 2024",
    readTime: "3 dk okuma",
    author: defaultAuthor,
    tags: ["Yıldızlar", "Dilek", "Gece Masalı"],
    category: "Hayallerim",
    mood: { emoji: "🌠", label: "Büyülenmiş" },
    weather: { emoji: "🌙", label: "Yıldızlı Gece" },
    isFavorite: false,
    reactions: { "✨": 21, "🌙": 14, "💖": 12 }
  },
  {
    id: "entry-6",
    slug: "en-sevdigim-masal-kitabini-bitirdim",
    title: "Uçan Balonlar ve Masal Ormanı Kitabı 📖",
    excerpt: "3 gündür okuduğum masal kitabının son sayfasına geldim. Ormandaki hayvanların dostluk hikayesi beni çok duygulandırdı.",
    content: `Sevgili Günlük,

Kütüphanemdeki 'Sihirli Ormanın Küçük Dostları' adlı kalın masal kitabımı bugün tamamladım.

Kitapta kaybolan yavru bir sincabın ormandaki diğer bilge baykuş, neşeli kirpi ve dost canlısı geyik sayesinde yuvasına kavuşması anlatılıyordu. En çok kirpinin sırtındaki elmalarla sincaba yardım ettiği bölümü sevdim.

Kitap okurken kendimi o ormanın ağaçları arasında koşuyor gibi hissediyorum. Kitap bittiğinde biraz hüzünlendim çünkü kahramanları çok sevmiştim. Ama yarın kütüphaneden yeni bir macera kitabı seçeceğim!

Her kitabın kapağı yeni bir dünyaya açılan sihirli bir kapıdır.`,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=800&fit=crop&q=80",
    date: "04 Ağustos 2024",
    readTime: "2 dk okuma",
    author: defaultAuthor,
    tags: ["Kitaplar", "Masallar", "Okuma Saati"],
    category: "Masal Dünyam",
    mood: { emoji: "🔍", label: "Meraklı" },
    weather: { emoji: "☀️", label: "Güneşli" },
    isFavorite: false,
    reactions: { "📖": 15, "❤️": 11, "✨": 8 }
  }
];
