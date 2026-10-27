/**
 * Avatar & Wardrobe Studio Engine (Modular SVG Vector Avatar System)
 * Mengatur katalog aksesoris, pakaian, topi, aura, sistem pembelian dengan poin/EXP kuis,
 * dan rendering avatar SVG modular yang presisi dan pas di badan/kepala karakter.
 */

const AVATAR_CATALOG = {
  base: [
    { id: 'base-mage', name: 'Cyber Mage', icon: '🧙‍♂️', type: 'base', price: 0, desc: 'Penyihir digital dengan aura kosmik.' },
    { id: 'base-knight', name: 'Robo Knight', icon: '🤖', type: 'base', price: 0, desc: 'Ksatria cyber tangguh pelindung kelas.' },
    { id: 'base-ninja', name: 'Astro Ninja', icon: '🥷', type: 'base', price: 0, desc: 'Ninja gesit penjelajah kecepatan cahaya.' },
    { id: 'base-fox', name: 'Pixel Fox', icon: '🦊', type: 'base', price: 0, desc: 'Pahlawan rubah cerdik pemecah rumus.' },
    { id: 'base-alchemist', name: 'Neon Alchemist', icon: '🧪', type: 'base', price: 0, desc: 'Ilmuwan jenius peracik pengetahuan.' },
    { id: 'base-cat', name: 'Mecha Neko', icon: '🐱', type: 'base', price: 350, desc: 'Kucing mecha imut dengan insting presisi.' },
    { id: 'base-lion', name: 'Galaxy Lion', icon: '🦁', type: 'base', price: 500, desc: 'Singa antariksa dengan jiwa kepemimpinan.' },
    { id: 'base-monarch', name: 'Crown King', icon: '👑', type: 'base', price: 800, desc: 'Penguasa takhta kuis nomor 1.' }
  ],

  head: [
    { id: 'head-none', name: 'Tanpa Topi', icon: '❌', type: 'head', price: 0, desc: 'Menampilkan gaya rambut alami yang rapi.' },
    { id: 'head-grad', name: 'Topi Sarjana Juara', icon: '🎓', type: 'head', price: 200, desc: 'Topi toga wisudawan sarjana berprestasi.' },
    { id: 'head-crown', name: 'Mahkota Emas Sultan', icon: '👑', type: 'head', price: 600, desc: 'Mahkota bertatahkan batu permata mulia.' },
    { id: 'head-cowboy', name: 'Topi Koboi Petualang', icon: '🤠', type: 'head', price: 250, desc: 'Topi koboi kulit petualang tangguh.' },
    { id: 'head-vr', name: 'Kacamata VR Holo', icon: '🥽', type: 'head', price: 350, desc: 'Visor realitas virtual masa depan.' },
    { id: 'head-halo', name: 'Halo Malaikat Suci', icon: '😇', type: 'head', price: 500, desc: 'Lingkaran cahaya malaikat melayang berkilau.' },
    { id: 'head-tophat', name: 'Top Hat Bangsawan', icon: '🎩', type: 'head', price: 300, desc: 'Topi silinder hitam bangsawan terhormat.' },
    { id: 'head-headphones', name: 'Headset Gaming RGB', icon: '🎧', type: 'head', price: 400, desc: 'Headphone musik gamer dengan lampu LED neon.' }
  ],

  outfit: [
    { id: 'outfit-casual', name: 'Baju Kasual Siswa', icon: '👕', type: 'outfit', price: 0, desc: 'Kaos santai berkerah modern dan sporty.' },
    { id: 'outfit-kimono', name: 'Kimono Pendekar Neon', icon: '🥋', type: 'outfit', price: 350, desc: 'Jubah kimono samurai dengan obi dan garis neon.' },
    { id: 'outfit-robe', name: 'Jubah Sihir Keemasan', icon: '🦹', type: 'outfit', price: 550, desc: 'Jubah sutra astral bertabur bintang.' },
    { id: 'outfit-armor', name: 'Zirah Baja Berlian', icon: '🛡️', type: 'outfit', price: 650, desc: 'Baju zirah pelat baja cyber dengan reaktor dada.' },
    { id: 'outfit-suit', name: 'Jas Formal Einstein', icon: '👔', type: 'outfit', price: 400, desc: 'Setelan jas resmi dengan dasi untuk cendekiawan.' },
    { id: 'outfit-cyber', name: 'Cyberpunk Tech Jacket', icon: '🧥', type: 'outfit', price: 500, desc: 'Jaket street hoodie masa depan bercahaya.' },
    { id: 'outfit-lab', name: 'Jas Laboratorium Kimia', icon: '🥼', type: 'outfit', price: 250, desc: 'Jas putih peneliti dengan pulpen di saku.' }
  ],

  face: [
    { id: 'face-none', name: 'Tanpa Kacamata', icon: '❌', type: 'face', price: 0, desc: 'Wajah polos tanpa aksesoris tambahan.' },
    { id: 'face-thug', name: 'Kacamata Thug Life', icon: '🕶️', type: 'face', price: 200, desc: 'Kacamata hitam piksel 8-bit juara santai.' },
    { id: 'face-smart', name: 'Kacamata Cerdas Profesor', icon: '👓', type: 'face', price: 150, desc: 'Kacamata bingkai bulat pembaca rumus kilat.' },
    { id: 'face-mask', name: 'Masker Neon Cyber', icon: '🎭', type: 'face', price: 300, desc: 'Masker respirator cyberpunk pelindung partikel.' },
    { id: 'face-monocle', name: 'Monocle Emas Klasik', icon: '🧐', type: 'face', price: 250, desc: 'Lensa mata tunggal detektif berantai emas.' },
    { id: 'face-pirate', name: 'Penutup Mata Bajak Laut', icon: '🏴‍☠️', type: 'face', price: 200, desc: 'Penutup mata kulit kapten penjelajah samudra.' },
    { id: 'face-star', name: 'Tato Bintang Berkilau', icon: '⭐', type: 'face', price: 180, desc: 'Bintang neon berkilau di pelipis mata.' }
  ],

  aura: [
    { id: 'aura-none', name: 'Tanpa Efek Aura', icon: '⚪', type: 'aura', price: 0, desc: 'Tampilan bersih tanpa efek latar.' },
    { id: 'aura-wings', name: 'Sayap Emas Kemenangan', icon: '🪽', type: 'aura', price: 750, desc: 'Sepasang sayap emas membentang gagah.', class: 'aura-effect-wings' },
    { id: 'aura-fire', name: 'Kobaran Api Semangat', icon: '🔥', type: 'aura', price: 500, desc: 'Aura api membara tanda kombo tak terhentikan.', class: 'aura-effect-fire' },
    { id: 'aura-frost', name: 'Kristal Es Frostbite', icon: '❄️', type: 'aura', price: 450, desc: 'Kristal es salju berputar anggun.', class: 'aura-effect-frost' },
    { id: 'aura-thunder', name: 'Petir Badai Juara', icon: '⚡', type: 'aura', price: 600, desc: 'Kilatan petir biru melingkari pahlawan.', class: 'aura-effect-thunder' },
    { id: 'aura-rainbow', name: 'Pelangi Spektrum Juara', icon: '🌈', type: 'aura', price: 650, desc: 'Lingkaran spektrum pelangi bersinar hangat.', class: 'aura-effect-rainbow' }
  ]
};

class AvatarManager {
  constructor() {
    this.currentCategory = 'head';
  }

  getProfile() {
    const defaultProfile = {
      name: 'Siswa Juara',
      points: 750, // Starter bonus points to immediately try the shop!
      totalExp: 750,
      avatar: {
        base: 'base-mage',
        head: 'head-none',
        outfit: 'outfit-casual',
        face: 'face-none',
        aura: 'aura-none'
      },
      inventory: [
        'base-mage', 'base-knight', 'base-ninja', 'base-fox', 'base-alchemist',
        'head-none', 'outfit-casual', 'face-none', 'aura-none'
      ]
    };

    try {
      const saved = localStorage.getItem('qa_student_avatar_v2');
      if (!saved) {
        this.saveProfile(defaultProfile);
        return defaultProfile;
      }
      const parsed = JSON.parse(saved);
      return {
        ...defaultProfile,
        ...parsed,
        avatar: { ...defaultProfile.avatar, ...(parsed.avatar || {}) },
        inventory: Array.isArray(parsed.inventory) ? parsed.inventory : defaultProfile.inventory
      };
    } catch (e) {
      return defaultProfile;
    }
  }

  saveProfile(profile) {
    try {
      localStorage.setItem('qa_student_avatar_v2', JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving avatar profile:', e);
    }
  }

  addPoints(amount) {
    const profile = this.getProfile();
    profile.points = (profile.points || 0) + amount;
    profile.totalExp = (profile.totalExp || 0) + amount;
    this.saveProfile(profile);
    this.updatePointsDisplay();
    return profile.points;
  }

  equipItem(category, itemId) {
    const profile = this.getProfile();
    if (!profile.inventory.includes(itemId)) {
      return { success: false, message: 'Item belum dibeli di toko!' };
    }

    profile.avatar[category] = itemId;
    this.saveProfile(profile);
    if (window.soundEngine) window.soundEngine.playBuff();
    return { success: true, message: 'Berhasil memakai item!' };
  }

  buyItem(category, itemId) {
    const profile = this.getProfile();
    const item = this.getItemById(category, itemId);

    if (!item) return { success: false, message: 'Item tidak ditemukan!' };
    if (profile.inventory.includes(itemId)) {
      return { success: false, message: 'Kamu sudah memiliki item ini!' };
    }

    if ((profile.points || 0) < item.price) {
      return {
        success: false,
        message: `Poin tidak cukup! Butuh ${item.price} Poin. Kamu memiliki ${profile.points || 0} Poin. Ikuti kuis untuk mengumpulkan lebih banyak poin!`
      };
    }

    profile.points -= item.price;
    profile.inventory.push(itemId);
    profile.avatar[category] = itemId;

    this.saveProfile(profile);
    if (window.soundEngine) window.soundEngine.playCoin();

    this.updatePointsDisplay();
    return { success: true, message: `🎉 Berhasil membeli & memakai ${item.name}!` };
  }

  getItemById(category, itemId) {
    const list = AVATAR_CATALOG[category] || [];
    return list.find(item => item.id === itemId) || null;
  }

  findItemAnywhere(itemId) {
    for (const cat of Object.keys(AVATAR_CATALOG)) {
      const found = AVATAR_CATALOG[cat].find(i => i.id === itemId);
      if (found) return found;
    }
    return null;
  }

  // ========================================================
  // MODULAR VECTOR SVG AVATAR GENERATOR
  // Menggambar avatar lapis demi lapis dengan koordinat presisi
  // ========================================================
  buildAvatarSVG(cfg) {
    const baseId = cfg.base || 'base-mage';
    const headId = cfg.head || 'head-none';
    const outfitId = cfg.outfit || 'outfit-casual';
    const faceId = cfg.face || 'face-none';
    const auraId = cfg.aura || 'aura-none';

    // 1. PALET WARNA KARAKTER DASAR
    let skinColor = '#fed7aa'; // light peach
    let eyeColor = '#1e293b';
    let hairColor = '#3b82f6';
    let earColor = '#fdba74';
    let blushColor = 'rgba(244, 63, 94, 0.4)';

    if (baseId === 'base-knight') {
      skinColor = '#94a3b8'; // cyber steel
      eyeColor = '#06b6d4'; // cyan neon
      hairColor = '#475569';
      earColor = '#64748b';
    } else if (baseId === 'base-ninja') {
      skinColor = '#fde047'; // warm
      eyeColor = '#dc2626'; // crimson
      hairColor = '#18181b'; // obsidian black
      earColor = '#facc15';
    } else if (baseId === 'base-fox') {
      skinColor = '#fb923c'; // orange fox
      eyeColor = '#15803d'; // emerald
      hairColor = '#f97316';
      earColor = '#ea580c';
    } else if (baseId === 'base-alchemist') {
      skinColor = '#fecdd3';
      eyeColor = '#8b5cf6';
      hairColor = '#10b981'; // neon emerald hair
      earColor = '#fda4af';
    } else if (baseId === 'base-cat') {
      skinColor = '#e2e8f0'; // white cat
      eyeColor = '#ec4899'; // pink neon
      hairColor = '#cbd5e1';
      earColor = '#f472b6';
    } else if (baseId === 'base-lion') {
      skinColor = '#fcd34d'; // golden
      eyeColor = '#b45309';
      hairColor = '#d97706';
      earColor = '#f59e0b';
    } else if (baseId === 'base-monarch') {
      skinColor = '#ffedd5';
      eyeColor = '#4338ca';
      hairColor = '#eab308'; // blonde gold
      earColor = '#fed7aa';
    }

    // 2. LAYER AURA (Di belakang badan)
    let auraSVG = '';
    if (auraId === 'aura-wings') {
      auraSVG = `
        <g class="svg-aura-wings">
          <!-- Sayap Kiri -->
          <path d="M70,120 C30,90 10,40 5,10 C15,45 35,65 50,75 C25,50 35,20 60,35 C50,60 65,85 75,105 Z" fill="url(#grad-gold-wings)" opacity="0.9" filter="drop-shadow(0 0 10px #f59e0b)"/>
          <path d="M60,110 C35,80 20,40 25,25 C35,50 50,70 65,85 Z" fill="#fef08a" opacity="0.8"/>
          <!-- Sayap Kanan -->
          <path d="M130,120 C170,90 190,40 195,10 C185,45 165,65 150,75 C175,50 165,20 140,35 C150,60 135,85 125,105 Z" fill="url(#grad-gold-wings)" opacity="0.9" filter="drop-shadow(0 0 10px #f59e0b)"/>
          <path d="M140,110 C165,80 180,40 175,25 C165,50 150,70 135,85 Z" fill="#fef08a" opacity="0.8"/>
        </g>
      `;
    } else if (auraId === 'aura-fire') {
      auraSVG = `
        <g class="svg-aura-fire">
          <circle cx="100" cy="110" r="95" fill="url(#grad-fire-glow)" opacity="0.5"/>
          <path d="M25,180 Q40,90 60,60 Q70,90 85,40 Q95,70 100,20 Q105,70 115,40 Q130,90 140,60 Q160,90 175,180 Z" fill="url(#grad-fire-flame)" opacity="0.85" filter="drop-shadow(0 0 15px #ef4444)"/>
        </g>
      `;
    } else if (auraId === 'aura-frost') {
      auraSVG = `
        <g class="svg-aura-frost">
          <circle cx="100" cy="110" r="92" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 6" fill="url(#grad-frost-glow)" opacity="0.6"/>
          <!-- Kristal Es -->
          <path d="M100,10 L108,30 L100,50 L92,30 Z" fill="#bae6fd" filter="drop-shadow(0 0 6px #38bdf8)"/>
          <path d="M20,100 L40,108 L60,100 L40,92 Z" fill="#bae6fd" filter="drop-shadow(0 0 6px #38bdf8)"/>
          <path d="M180,100 L160,108 L140,100 L160,92 Z" fill="#bae6fd" filter="drop-shadow(0 0 6px #38bdf8)"/>
          <path d="M35,45 L50,60 L40,75 L25,60 Z" fill="#e0f2fe"/>
          <path d="M165,45 L175,60 L160,75 L150,60 Z" fill="#e0f2fe"/>
        </g>
      `;
    } else if (auraId === 'aura-thunder') {
      auraSVG = `
        <g class="svg-aura-thunder">
          <circle cx="100" cy="110" r="90" fill="url(#grad-thunder-glow)" opacity="0.4"/>
          <!-- Petir -->
          <path d="M30,50 L50,90 L40,95 L65,145 L45,105 L55,100 Z" fill="#38bdf8" filter="drop-shadow(0 0 10px #06b6d4)"/>
          <path d="M170,50 L150,90 L160,95 L135,145 L155,105 L145,100 Z" fill="#818cf8" filter="drop-shadow(0 0 10px #6366f1)"/>
        </g>
      `;
    } else if (auraId === 'aura-rainbow') {
      auraSVG = `
        <g class="svg-aura-rainbow">
          <circle cx="100" cy="110" r="88" stroke="url(#grad-rainbow-ring)" stroke-width="8" fill="none" opacity="0.8" filter="drop-shadow(0 0 12px #c084fc)"/>
          <circle cx="45" cy="45" r="4" fill="#fde047" filter="drop-shadow(0 0 5px #facc15)"/>
          <circle cx="155" cy="45" r="5" fill="#f43f5e" filter="drop-shadow(0 0 5px #fb7185)"/>
          <circle cx="170" cy="120" r="4" fill="#38bdf8"/>
        </g>
      `;
    }

    // 3. LAYER TUBUH DASAR & KEPALA
    // Telinga khusus untuk Rubah / Kucing / Singa
    let extraEarsSVG = '';
    if (baseId === 'base-fox' || baseId === 'base-cat') {
      extraEarsSVG = `
        <polygon points="62,60 48,15 82,42" fill="${earColor}" stroke="#1e293b" stroke-width="2"/>
        <polygon points="60,52 52,24 74,44" fill="#fed7aa"/>
        <polygon points="138,60 152,15 118,42" fill="${earColor}" stroke="#1e293b" stroke-width="2"/>
        <polygon points="140,52 148,24 126,44" fill="#fed7aa"/>
      `;
    } else if (baseId === 'base-lion') {
      extraEarsSVG = `
        <circle cx="100" cy="85" r="58" fill="#d97706" opacity="0.9"/>
        <circle cx="55" cy="55" r="14" fill="#b45309"/>
        <circle cx="145" cy="55" r="14" fill="#b45309"/>
      `;
    }

    // Rambut Dasar
    let hairSVG = '';
    if (headId === 'head-none') {
      // Gaya rambut natural jika tidak memakai topi besar
      hairSVG = `
        <!-- Rambut Atas -->
        <path d="M56,75 C52,40 70,25 100,25 C130,25 148,40 144,75 C138,50 125,44 110,48 C95,42 80,48 68,54 C60,62 56,70 56,75 Z" fill="${hairColor}" stroke="#1e293b" stroke-width="2"/>
        <!-- Poni Samping -->
        <path d="M60,65 Q75,55 90,62 Q75,70 65,75 Z" fill="${hairColor}"/>
        <path d="M140,65 Q125,55 110,62 Q125,70 135,75 Z" fill="${hairColor}"/>
      `;
    }

    // 4. LAYER OUTFIT / PAKAIAN (Menempel di pundak & badan)
    let outfitSVG = '';
    if (outfitId === 'outfit-casual') {
      outfitSVG = `
        <g class="svg-outfit">
          <!-- Kaos Dasar -->
          <path d="M50,140 Q100,150 150,140 L162,215 L38,215 Z" fill="#059669" stroke="#047857" stroke-width="2"/>
          <!-- Lengan Kaos -->
          <path d="M50,140 L28,175 L52,185 L65,150 Z" fill="#10b981"/>
          <path d="M150,140 L172,175 L148,185 L135,150 Z" fill="#10b981"/>
          <!-- Kerah V-Neck & Garis Sporty -->
          <polygon points="85,142 100,165 115,142" fill="#ecfdf5"/>
          <path d="M40,200 L160,200" stroke="#a7f3d0" stroke-width="4"/>
          <!-- Emblem Bintang Dada -->
          <circle cx="75" cy="172" r="7" fill="#fbbf24"/>
        </g>
      `;
    } else if (outfitId === 'outfit-kimono') {
      outfitSVG = `
        <g class="svg-outfit">
          <!-- Jubah Kimono -->
          <path d="M46,138 L154,138 L165,215 L35,215 Z" fill="#1e1b4b" stroke="#312e81" stroke-width="2"/>
          <!-- Lipatan Kerah Bersilang (Left over Right) -->
          <path d="M72,138 L100,185 L128,138" stroke="#a855f7" stroke-width="8" fill="none"/>
          <path d="M72,138 L100,185 L128,138" stroke="#f59e0b" stroke-width="2" fill="none"/>
          <!-- Lengan Jubah Lebar -->
          <polygon points="46,138 20,185 45,205 60,155" fill="#312e81" stroke="#4c1d95" stroke-width="2"/>
          <polygon points="154,138 180,185 155,205 140,155" fill="#312e81" stroke="#4c1d95" stroke-width="2"/>
          <!-- Sabuk Obi Pinggang -->
          <rect x="55" y="182" width="90" height="20" fill="#a855f7" rx="3"/>
          <rect x="85" y="180" width="30" height="24" fill="#fbbf24" rx="2"/>
        </g>
      `;
    } else if (outfitId === 'outfit-robe') {
      outfitSVG = `
        <g class="svg-outfit">
          <!-- Jubah Astral Penyihir -->
          <path d="M44,138 Q100,146 156,138 L168,215 L32,215 Z" fill="#4338ca" stroke="#3730a3" stroke-width="2"/>
          <!-- Kerah Tinggi & List Emas -->
          <path d="M68,132 L100,172 L132,132" stroke="#facc15" stroke-width="5" fill="#312e81"/>
          <!-- Permata Dada Bercahaya -->
          <polygon points="100,165 108,175 100,185 92,175" fill="#06b6d4" stroke="#e0f2fe" stroke-width="2" filter="drop-shadow(0 0 6px #06b6d4)"/>
          <!-- Lengan Jubah Sihir -->
          <polygon points="44,138 18,185 45,210 65,155" fill="#3730a3"/>
          <polygon points="156,138 182,185 155,210 135,155" fill="#3730a3"/>
          <!-- Bintang-bintang pada Jubah -->
          <circle cx="65" cy="195" r="2" fill="#fef08a"/>
          <circle cx="135" cy="195" r="2" fill="#fef08a"/>
          <circle cx="100" cy="205" r="3" fill="#fef08a"/>
        </g>
      `;
    } else if (outfitId === 'outfit-armor') {
      outfitSVG = `
        <g class="svg-outfit">
          <!-- Pelat Baja Dada -->
          <path d="M48,138 L152,138 L160,215 L40,215 Z" fill="#334155" stroke="#1e293b" stroke-width="2"/>
          <polygon points="100,152 135,165 130,205 100,212 70,205 65,165" fill="#475569" stroke="#64748b" stroke-width="2"/>
          <!-- Reaktor Dada Neon Glowing Core -->
          <circle cx="100" cy="180" r="14" fill="#0f172a" stroke="#06b6d4" stroke-width="3"/>
          <circle cx="100" cy="180" r="8" fill="#38bdf8" filter="drop-shadow(0 0 8px #06b6d4)"/>
          <!-- Pauldron / Pelindung Pundak Baja -->
          <polygon points="48,136 20,150 25,180 62,165" fill="#64748b" stroke="#94a3b8" stroke-width="2"/>
          <polygon points="152,136 180,150 175,180 138,165" fill="#64748b" stroke="#94a3b8" stroke-width="2"/>
        </g>
      `;
    } else if (outfitId === 'outfit-suit') {
      outfitSVG = `
        <g class="svg-outfit">
          <!-- Kemeja Putih -->
          <polygon points="75,138 125,138 118,215 82,215" fill="#f8fafc"/>
          <!-- Dasi Biru -->
          <polygon points="96,145 104,145 107,185 100,195 93,185" fill="#2563eb"/>
          <!-- Jas Blazer Formal -->
          <path d="M48,138 L82,138 L94,185 L65,215 L38,215 Z" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
          <path d="M152,138 L118,138 L106,185 L135,215 L162,215 Z" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
          <!-- Saku Jas & Saputangan Merah -->
          <line x1="58" y1="175" x2="72" y2="175" stroke="#334155" stroke-width="2"/>
          <polygon points="62,174 65,168 69,174" fill="#ef4444"/>
        </g>
      `;
    } else if (outfitId === 'outfit-cyber') {
      outfitSVG = `
        <g class="svg-outfit">
          <!-- Cyber Hoodie Jacket -->
          <path d="M46,138 L154,138 L164,215 L36,215 Z" fill="#18181b" stroke="#27272a" stroke-width="2"/>
          <!-- Zipper Garis Tengah Neon Oranye -->
          <line x1="100" y1="140" x2="100" y2="215" stroke="#f97316" stroke-width="4"/>
          <!-- Kerah Tinggi Cyber -->
          <path d="M68,135 L88,155 L112,155 L132,135" stroke="#ea580c" stroke-width="4" fill="none"/>
          <!-- Patch Neon di Lengan & Dada -->
          <rect x="52" y="165" width="22" height="6" fill="#06b6d4" rx="2" filter="drop-shadow(0 0 4px #06b6d4)"/>
          <rect x="126" y="165" width="22" height="6" fill="#06b6d4" rx="2" filter="drop-shadow(0 0 4px #06b6d4)"/>
        </g>
      `;
    } else if (outfitId === 'outfit-lab') {
      outfitSVG = `
        <g class="svg-outfit">
          <!-- Baju Dalam Hijau Tua -->
          <rect x="75" y="140" width="50" height="75" fill="#0284c7"/>
          <!-- Jas Lab Putih Terbuka -->
          <path d="M48,138 L80,138 L88,185 L55,215 L36,215 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
          <path d="M152,138 L120,138 L112,185 L145,215 L164,215 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
          <!-- Saku dengan Pulpen -->
          <rect x="56" y="170" width="16" height="18" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
          <line x1="60" y1="166" x2="60" y2="173" stroke="#ef4444" stroke-width="2"/>
          <line x1="64" y1="166" x2="64" y2="173" stroke="#3b82f6" stroke-width="2"/>
          <!-- Kerah Jas Lab -->
          <polygon points="68,138 84,162 76,162" fill="#e2e8f0"/>
          <polygon points="132,138 116,162 124,162" fill="#e2e8f0"/>
        </g>
      `;
    }

    // 5. LAYER AKSESORIS WAJAH (Kacamata, Masker, Monocle, Eyepatch)
    let faceSVG = '';
    if (faceId === 'face-thug') {
      faceSVG = `
        <g class="svg-face-thug">
          <!-- Kacamata 8-Bit Pixel Thug Life -->
          <rect x="64" y="78" width="32" height="15" fill="#000000" rx="1"/>
          <rect x="104" y="78" width="32" height="15" fill="#000000" rx="1"/>
          <rect x="96" y="82" width="8" height="4" fill="#000000"/>
          <!-- Pixel White Glare -->
          <rect x="67" y="80" width="4" height="4" fill="#ffffff"/>
          <rect x="73" y="84" width="4" height="4" fill="#ffffff"/>
          <rect x="107" y="80" width="4" height="4" fill="#ffffff"/>
          <rect x="113" y="84" width="4" height="4" fill="#ffffff"/>
        </g>
      `;
    } else if (faceId === 'face-smart') {
      faceSVG = `
        <g class="svg-face-smart">
          <!-- Kacamata Bulat Cerdas Emas -->
          <circle cx="80" cy="85" r="14" fill="rgba(224, 242, 254, 0.45)" stroke="#f59e0b" stroke-width="3"/>
          <circle cx="120" cy="85" r="14" fill="rgba(224, 242, 254, 0.45)" stroke="#f59e0b" stroke-width="3"/>
          <line x1="94" y1="85" x2="106" y2="85" stroke="#f59e0b" stroke-width="3"/>
          <!-- Tangkai Kacamata -->
          <line x1="66" y1="83" x2="52" y2="80" stroke="#f59e0b" stroke-width="2"/>
          <line x1="134" y1="83" x2="148" y2="80" stroke="#f59e0b" stroke-width="2"/>
          <!-- Kilau Kaca -->
          <path d="M74,78 Q82,82 78,92" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.8"/>
          <path d="M114,78 Q122,82 118,92" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.8"/>
        </g>
      `;
    } else if (faceId === 'face-mask') {
      faceSVG = `
        <g class="svg-face-mask">
          <!-- Masker Cyberpunk Menutupi Mulut & Hidung -->
          <polygon points="76,92 124,92 118,122 100,128 82,122" fill="#18181b" stroke="#06b6d4" stroke-width="2"/>
          <!-- Filter Udara Kiri & Kanan -->
          <circle cx="82" cy="106" r="6" fill="#27272a" stroke="#06b6d4" stroke-width="1.5"/>
          <circle cx="118" cy="106" r="6" fill="#27272a" stroke="#06b6d4" stroke-width="1.5"/>
          <circle cx="100" cy="108" r="3" fill="#f43f5e"/>
          <!-- Tali Masker ke Telinga -->
          <line x1="76" y1="94" x2="54" y2="88" stroke="#3f3f46" stroke-width="2"/>
          <line x1="124" y1="94" x2="146" y2="88" stroke="#3f3f46" stroke-width="2"/>
        </g>
      `;
    } else if (faceId === 'face-monocle') {
      faceSVG = `
        <g class="svg-face-monocle">
          <!-- Monocle di Mata Kanan -->
          <circle cx="120" cy="85" r="14" fill="rgba(254, 240, 138, 0.35)" stroke="#eab308" stroke-width="3"/>
          <path d="M115,77 Q124,80 120,91" stroke="#ffffff" stroke-width="2" fill="none"/>
          <!-- Rantai Emas -->
          <path d="M134,85 Q145,110 135,145" stroke="#facc15" stroke-width="1.5" stroke-dasharray="2 2" fill="none"/>
        </g>
      `;
    } else if (faceId === 'face-pirate') {
      faceSVG = `
        <g class="svg-face-pirate">
          <!-- Tali Penutup Mata Diagonal -->
          <line x1="50" y1="70" x2="150" y2="105" stroke="#0f172a" stroke-width="3"/>
          <!-- Penutup Mata Kulit Kiri -->
          <ellipse cx="80" cy="85" rx="14" ry="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
          <!-- Simbol Tengkorak Kecil -->
          <circle cx="80" cy="84" r="3" fill="#e2e8f0"/>
          <rect x="79" y="87" width="2" height="3" fill="#e2e8f0"/>
        </g>
      `;
    } else if (faceId === 'face-star') {
      faceSVG = `
        <g class="svg-face-star">
          <!-- Bintang Neon di Pelipis Pipi Kiri -->
          <polygon points="68,98 70,102 75,103 71,106 72,110 68,107 64,110 65,106 61,103 66,102" fill="#facc15" filter="drop-shadow(0 0 5px #f59e0b)"/>
        </g>
      `;
    }

    // 6. LAYER TOPI & MAHKOTA (Menempel pas di atas kepala)
    let headwearSVG = '';
    if (headId === 'head-grad') {
      headwearSVG = `
        <g class="svg-headwear">
          <!-- Topi Toga Wisuda / Sarjana -->
          <polygon points="100,28 158,46 100,64 42,46" fill="#1e1b4b" stroke="#0f172a" stroke-width="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"/>
          <path d="M68,54 L68,66 Q100,76 132,66 L132,54" fill="#312e81"/>
          <!-- Kancing & Tali Rumbai Emas Menjuntai -->
          <circle cx="100" cy="46" r="3.5" fill="#facc15"/>
          <path d="M100,46 Q138,55 142,80" stroke="#facc15" stroke-width="2.5" fill="none"/>
          <polygon points="142,80 138,92 146,92" fill="#eab308"/>
        </g>
      `;
    } else if (headId === 'head-crown') {
      headwearSVG = `
        <g class="svg-headwear">
          <!-- Mahkota Emas Sultan -->
          <polygon points="56,58 60,30 78,44 100,20 122,44 140,30 144,58" fill="url(#grad-crown-gold)" stroke="#b45309" stroke-width="2" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))"/>
          <!-- Alas Mahkota -->
          <rect x="54" y="55" width="92" height="10" fill="#d97706" rx="2" stroke="#b45309" stroke-width="1.5"/>
          <!-- Batu Permata Rubi & Safir -->
          <circle cx="100" cy="40" r="5" fill="#ef4444" stroke="#ffffff" stroke-width="1"/>
          <circle cx="78" cy="50" r="4" fill="#06b6d4" stroke="#ffffff" stroke-width="1"/>
          <circle cx="122" cy="50" r="4" fill="#06b6d4" stroke="#ffffff" stroke-width="1"/>
          <circle cx="68" cy="60" r="2.5" fill="#ffffff"/>
          <circle cx="100" cy="60" r="3" fill="#ef4444"/>
          <circle cx="132" cy="60" r="2.5" fill="#ffffff"/>
        </g>
      `;
    } else if (headId === 'head-cowboy') {
      headwearSVG = `
        <g class="svg-headwear">
          <!-- Topi Stetson Koboi -->
          <!-- Pinggiran Topi Melengkung -->
          <ellipse cx="100" cy="55" rx="64" ry="15" fill="#78350f" stroke="#451a03" stroke-width="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))"/>
          <!-- Mahkota Topi Koboi -->
          <path d="M68,50 C68,26 82,24 100,28 C118,24 132,26 132,50 Z" fill="#92400e" stroke="#451a03" stroke-width="2"/>
          <!-- Sabuk Kulit Topi dengan Gesper Emas -->
          <rect x="68" y="44" width="64" height="6" fill="#451a03"/>
          <rect x="96" y="43" width="8" height="8" fill="#facc15" stroke="#78350f" stroke-width="1"/>
        </g>
      `;
    } else if (headId === 'head-vr') {
      headwearSVG = `
        <g class="svg-headwear">
          <!-- Visor Kacamata VR Futuristik -->
          <path d="M52,70 L148,70 L144,98 L56,98 Z" fill="#090d16" stroke="#06b6d4" stroke-width="2.5" rx="4" filter="drop-shadow(0 0 10px #06b6d4)"/>
          <!-- Tali Pengikat Kepala Kiri & Kanan -->
          <line x1="52" y1="80" x2="38" y2="82" stroke="#475569" stroke-width="5"/>
          <line x1="148" y1="80" x2="162" y2="82" stroke="#475569" stroke-width="5"/>
          <!-- Tampilan Layar Hologram Cyan Neon -->
          <rect x="62" y="75" width="76" height="18" fill="url(#grad-vr-holo)" rx="2"/>
          <line x1="66" y1="84" x2="134" y2="84" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/>
        </g>
      `;
    } else if (headId === 'head-halo') {
      headwearSVG = `
        <g class="svg-headwear">
          <!-- Lingkaran Halo Malaikat Melayang -->
          <ellipse cx="100" cy="22" rx="42" ry="12" fill="none" stroke="#facc15" stroke-width="6" filter="drop-shadow(0 0 12px #f59e0b)"/>
          <ellipse cx="100" cy="22" rx="42" ry="12" fill="none" stroke="#fef08a" stroke-width="2"/>
          <!-- Kilau Cahaya -->
          <circle cx="65" cy="18" r="2.5" fill="#ffffff"/>
          <circle cx="135" cy="18" r="2" fill="#ffffff"/>
        </g>
      `;
    } else if (headId === 'head-tophat') {
      headwearSVG = `
        <g class="svg-headwear">
          <!-- Topi Silinder Bangsawan -->
          <ellipse cx="100" cy="56" rx="48" ry="10" fill="#0f172a" stroke="#020617" stroke-width="2" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"/>
          <path d="M72,55 L74,18 L126,18 L128,55 Z" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
          <ellipse cx="100" cy="18" rx="26" ry="6" fill="#334155"/>
          <!-- Pita Merah Sutra -->
          <rect x="73" y="47" width="54" height="7" fill="#ef4444"/>
        </g>
      `;
    } else if (headId === 'head-headphones') {
      headwearSVG = `
        <g class="svg-headwear">
          <!-- Bando Headset Gaming RGB -->
          <path d="M46,85 C46,35 154,35 154,85" stroke="#18181b" stroke-width="8" fill="none" stroke-linecap="round"/>
          <path d="M60,48 C75,38 125,38 140,48" stroke="#a855f7" stroke-width="3" fill="none" filter="drop-shadow(0 0 6px #a855f7)"/>
          <!-- Earcup Kiri dengan Lampu RGB Cyan -->
          <rect x="38" y="72" width="16" height="30" rx="6" fill="#27272a" stroke="#06b6d4" stroke-width="2.5" filter="drop-shadow(0 0 6px #06b6d4)"/>
          <!-- Earcup Kanan dengan Lampu RGB Cyan -->
          <rect x="146" y="72" width="16" height="30" rx="6" fill="#27272a" stroke="#06b6d4" stroke-width="2.5" filter="drop-shadow(0 0 6px #06b6d4)"/>
          <!-- Mic Tangkai Gaming -->
          <path d="M46,95 Q52,118 70,118" stroke="#475569" stroke-width="2.5" fill="none"/>
          <circle cx="72" cy="118" r="3" fill="#06b6d4"/>
        </g>
      `;
    }

    return `
      <svg viewBox="0 0 200 220" width="100%" height="100%" class="avatar-svg-canvas" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Gradients -->
          <linearGradient id="grad-gold-wings" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>

          <radialGradient id="grad-fire-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.8"/>
            <stop offset="60%" stop-color="#f97316" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#f97316" stop-opacity="0"/>
          </radialGradient>

          <linearGradient id="grad-fire-flame" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#dc2626"/>
            <stop offset="50%" stop-color="#f97316"/>
            <stop offset="100%" stop-color="#fde047"/>
          </linearGradient>

          <radialGradient id="grad-frost-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.7"/>
            <stop offset="60%" stop-color="#0284c7" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
          </radialGradient>

          <radialGradient id="grad-thunder-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#6366f1" stop-opacity="0.8"/>
            <stop offset="70%" stop-color="#06b6d4" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
          </radialGradient>

          <linearGradient id="grad-rainbow-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f43f5e"/>
            <stop offset="25%" stop-color="#fbbf24"/>
            <stop offset="50%" stop-color="#10b981"/>
            <stop offset="75%" stop-color="#06b6d4"/>
            <stop offset="100%" stop-color="#8b5cf6"/>
          </linearGradient>

          <linearGradient id="grad-crown-gold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="60%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#ca8a04"/>
          </linearGradient>

          <linearGradient id="grad-vr-holo" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#06b6d4"/>
            <stop offset="50%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#818cf8"/>
          </linearGradient>
        </defs>

        <!-- 1. LAYER AURA (Belakang) -->
        ${auraSVG}

        <!-- 2. LAYER LEHER & PUNDAK DASAR -->
        <g class="svg-base-body">
          <rect x="90" y="112" width="20" height="28" fill="${skinColor}"/>
          <path d="M48,138 Q100,146 152,138 L160,215 L40,215 Z" fill="${skinColor}"/>
        </g>

        <!-- 3. LAYER OUTFIT / PAKAIAN (Menempel di Pundak & Dada) -->
        ${outfitSVG}

        <!-- 4. LAYER TELINGA KHUSUS -->
        ${extraEarsSVG}

        <!-- 5. LAYER KEPALA & WAJAH -->
        <g class="svg-head-base">
          <!-- Telinga Kiri & Kanan -->
          <circle cx="58" cy="85" r="9" fill="${earColor}"/>
          <circle cx="142" cy="85" r="9" fill="${earColor}"/>
          <!-- Bentuk Kepala Bulat Halus -->
          <circle cx="100" cy="85" r="42" fill="${skinColor}" stroke="#1e293b" stroke-width="2"/>

          <!-- Rambut Alami (jika tidak terhalang) -->
          ${hairSVG}

          <!-- Alis Mata -->
          <path d="M72,73 Q82,69 90,73" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" fill="none"/>
          <path d="M110,73 Q118,69 128,73" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" fill="none"/>

          <!-- Mata Ekspresif Karakter -->
          <ellipse cx="80" cy="84" rx="5.5" ry="7" fill="${eyeColor}"/>
          <circle cx="78.5" cy="82" r="2.5" fill="#ffffff"/>
          <ellipse cx="120" cy="84" rx="5.5" ry="7" fill="${eyeColor}"/>
          <circle cx="118.5" cy="82" r="2.5" fill="#ffffff"/>

          <!-- Hidung Kecil & Blush Pipi -->
          <circle cx="70" cy="94" r="5" fill="${blushColor}"/>
          <circle cx="130" cy="94" r="5" fill="${blushColor}"/>
          <circle cx="100" cy="92" r="2" fill="#d97706" opacity="0.6"/>

          <!-- Senyum Ramah Juara -->
          <path d="M92,102 Q100,111 108,102" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        </g>

        <!-- 6. LAYER AKSESORIS WAJAH (Kacamata / Masker) -->
        ${faceSVG}

        <!-- 7. LAYER TOPI & MAHKOTA (Pas di Atas Kepala) -->
        ${headwearSVG}
      </svg>
    `;
  }

  renderAvatarHTML(avatarConfig, size = 'md') {
    const cfg = avatarConfig || this.getProfile().avatar;
    const auraDef = this.getItemById('aura', cfg.aura);
    const auraClass = (auraDef && auraDef.class) ? auraDef.class : '';

    return `
      <div class="avatar-composite-svg size-${size} ${auraClass}">
        ${this.buildAvatarSVG(cfg)}
      </div>
    `;
  }

  renderAvatarPreview(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const profile = this.getProfile();
    container.innerHTML = this.renderAvatarHTML(profile.avatar, 'lg');
  }

  updatePointsDisplay() {
    const profile = this.getProfile();
    const pts = profile.points || 0;

    const els = document.querySelectorAll('.user-points-val');
    els.forEach(el => {
      el.textContent = pts.toLocaleString('id-ID');
    });
  }

  // Render Toko / Wardrobe Interface
  renderShopCategory(category) {
    this.currentCategory = category;
    const grid = document.getElementById('shop-items-grid');
    if (!grid) return;

    const profile = this.getProfile();
    const items = AVATAR_CATALOG[category] || [];
    grid.innerHTML = '';

    items.forEach(item => {
      const isOwned = profile.inventory.includes(item.id);
      const isEquipped = profile.avatar[category] === item.id;

      const card = document.createElement('div');
      card.className = `shop-item-card glass-panel ${isEquipped ? 'item-equipped' : ''} ${isOwned ? 'item-owned' : ''}`;

      // Create preview mini configuration to preview this specific item!
      const previewCfg = { ...profile.avatar, [category]: item.id };
      const itemVisualPreview = this.renderAvatarHTML(previewCfg, 'sm');

      card.innerHTML = `
        <div class="item-icon-wrap">
          <div class="item-mini-preview">
            ${itemVisualPreview}
          </div>
          <span class="shop-item-badge-icon">${item.icon}</span>
          ${isEquipped ? '<span class="equipped-badge">Dipakai</span>' : ''}
          ${isOwned && !isEquipped ? '<span class="owned-badge">Dimiliki</span>' : ''}
        </div>
        <h4 class="shop-item-title">${item.name}</h4>
        <p class="shop-item-desc">${item.desc}</p>
        
        <div class="shop-item-footer">
          <span class="shop-item-price">
            ${item.price === 0 ? '🎁 Gratis' : `💎 ${item.price} Pts`}
          </span>

          <div class="shop-action-btn-wrap">
            ${isEquipped ? `
              <button class="btn-item-action btn-equipped-disabled" disabled>✓ Sedang Dipakai</button>
            ` : isOwned ? `
              <button class="btn-item-action btn-equip" data-cat="${category}" data-id="${item.id}">Gunakan</button>
            ` : `
              <button class="btn-item-action btn-buy" data-cat="${category}" data-id="${item.id}">
                Beli Sekarang
              </button>
            `}
          </div>
        </div>
      `;

      // Event Listeners
      const btnEquip = card.querySelector('.btn-equip');
      if (btnEquip) {
        btnEquip.onclick = () => {
          const res = this.equipItem(category, item.id);
          this.renderAvatarPreview('shop-avatar-large-preview');
          this.renderShopCategory(category);
          if (window.renderLobbyAvatarPreview) window.renderLobbyAvatarPreview();
          if (window.gameController && window.gameController.showToast) {
            window.gameController.showToast(res.message, 'success');
          }
        };
      }

      const btnBuy = card.querySelector('.btn-buy');
      if (btnBuy) {
        btnBuy.onclick = () => {
          const res = this.buyItem(category, item.id);
          if (res.success) {
            this.renderAvatarPreview('shop-avatar-large-preview');
            this.renderShopCategory(category);
            if (window.renderLobbyAvatarPreview) window.renderLobbyAvatarPreview();
            if (window.gameController && window.gameController.showToast) {
              window.gameController.showToast(res.message, 'success');
            }
          } else {
            alert(res.message);
          }
        };
      }

      grid.appendChild(card);
    });

    // Update active tab button style
    document.querySelectorAll('.shop-cat-btn').forEach(b => {
      if (b.dataset.category === category) {
        b.classList.add('cat-active');
      } else {
        b.classList.remove('cat-active');
      }
    });
  }
}

window.avatarManager = new AvatarManager();
window.AVATAR_CATALOG = AVATAR_CATALOG;
