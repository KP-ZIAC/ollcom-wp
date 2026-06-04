/** Тарифи ОЛЛ-КОМ — дані для головної сторінки */
window.OLLKOM_TARIFFS = {
  internet: {
    bb: {
      label: "Багатоквартирні будинки",
      hint: "ЖК від 300 квартир",
      plans: [
        { name: "Екстрім", speed: "100", price: "250" },
        { name: "Турбо", speed: "200", price: "350" },
        { name: "Преміум", speed: "1000", price: "400" },
      ],
    },
    bpm: {
      label: "Приватні будинки",
      hint: "м. Ужгород",
      plans: [
        { name: "Ефектив", speed: "50", price: "300" },
        { name: "Екстрім", speed: "100", price: "320" },
        { name: "Турбо", speed: "200", price: "350" },
      ],
    },
    bpr: {
      label: "Приватні будинки",
      hint: "район",
      plans: [
        { name: "Ефектив", speed: "50", price: "260" },
        { name: "Екстрім", speed: "100", price: "280" },
        { name: "Турбо", speed: "200", price: "350" },
      ],
    },
    aa: {
      label: "Акційні",
      hint: "деталі у оператора",
      plans: [
        { name: "Акційний", speed: "100", price: "200", featured: true },
      ],
    },
  },
  tv: [
    { name: "UA:Новини", channels: 27, price: "0", hasChannelList: true },
    { name: "UA:Ефір", channels: 130, price: "119", hasChannelList: true },
    { name: "Преміум", channels: 160, price: "138", hasChannelList: true },
    { name: "VIP HD", channels: 181, price: "168", hasChannelList: true },
  ],
  heroSlides: [
    {
      src: "images/hero-promo.jpg",
      alt: "Акційні тарифи ОЛЛ-КОМ",
      badge: "Акція",
      title: "Інтернет від 200 грн/міс",
      text: "Вигідні умови підключення для багатоквартирних будинків та приватного сектору в Закарпатті.",
      cta: { label: "Обрати тариф", href: "#inet" },
    },
    {
      src: "images/hero-internet.jpg",
      alt: "Оптоволокно PON — швидкий інтернет",
      badge: "Інтернет",
      title: "Оптоволокно PON до 1 Гбіт/с",
      text: "Стабільне з'єднання для дому, роботи та розваг. Тарифи на будь-який бюджет.",
      cta: { label: "Переглянути тарифи", href: "#inet" },
    },
    {
      src: "images/hero-tv.jpg",
      alt: "Цифрове телебачення OmegaTV",
      badge: "Телебачення",
      title: "Цифрове ТБ OmegaTV",
      text: "Понад 180 каналів у HD. Пакети від 0 грн/міс разом з інтернетом.",
      cta: { label: "Пакети ТБ", href: "#tv" },
    },
  ],
};
