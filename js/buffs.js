/**
 * Sistem Buff & Power-Up ClassQuest
 * Mengelola definisi buff, efek mekanik, roulette drop, dan inventory pemain
 */

const BUFF_DEFINITIONS = {
  freeze: {
    id: 'freeze',
    name: 'Chronos Freeze',
    tag: 'Beku Waktu',
    icon: '❄️',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.4)',
    cost: 150,
    desc: 'Hentikan countdown waktu selama 15 detik untuk berpikir santai tanpa penalti kecepatan.',
    duration: 15 // seconds
  },
  shield: {
    id: 'shield',
    name: 'Aegis Shield',
    tag: 'Perisai Kebal',
    icon: '🛡️',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.4)',
    cost: 200,
    desc: 'Melindungi nyawa & kombo streak jika jawaban salah! Streak tetap bertahan utuh.'
  },
  fifty_fifty: {
    id: 'fifty_fifty',
    name: '50:50 Sonar',
    tag: 'Eliminasi 2 Opsi',
    icon: '🎯',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)',
    cost: 180,
    desc: 'Menghapus 2 opsi jawaban yang salah seketika, menyisakan 2 pilihan terbaik.'
  },
  double_surge: {
    id: 'double_surge',
    name: 'Double Surge',
    tag: 'Ganda Poin 2x',
    icon: '⚡',
    color: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.4)',
    cost: 220,
    desc: 'Melipatgandakan poin perolehan pada soal ini menjadi 2x lipat jika jawabanmu benar!'
  },
  oracle: {
    id: 'oracle',
    name: 'Oracle Lens',
    tag: 'Petunjuk Guru',
    icon: '🔮',
    color: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.4)',
    cost: 120,
    desc: 'Membuka petunjuk tersembunyi (hint) dari pembuat soal/guru untuk memandu jawaban.'
  },
  second_chance: {
    id: 'second_chance',
    name: 'Phoenix Rebirth',
    tag: 'Peluang Kedua',
    icon: '🔄',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
    cost: 250,
    desc: 'Jika salah memilih jawaban, dapatkan 1 kesempatan ekstra untuk mencoba opsi lain.'
  },
  jackpot: {
    id: 'jackpot',
    name: 'Jackpot Rush',
    tag: 'Bonus Kilat',
    icon: '💎',
    color: '#eab308',
    glow: 'rgba(234, 179, 8, 0.4)',
    cost: 160,
    desc: 'Dapatkan ekstra +500 skor instan jika menjawab benar dalam 5 detik pertama!'
  },
  clarity: {
    id: 'clarity',
    name: 'Mind Clarity',
    tag: 'Aura Jawaban',
    icon: '🧠',
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.4)',
    cost: 210,
    desc: 'Menyorot opsi jawaban yang paling berpotensi benar dengan aura neon berkilau.'
  }
};

const AVATAR_CHARACTERS = [
  {
    id: 'cyber-mage',
    name: 'Cyber Mage',
    role: 'Penyihir Digital',
    icon: '🧙‍♂️',
    passiveText: 'Mulai kuis dengan 1x Free Oracle Lens (Petunjuk)',
    startBuff: 'oracle'
  },
  {
    id: 'robo-knight',
    name: 'Robo Knight',
    role: 'Ksatria Baja',
    icon: '🤖',
    passiveText: 'Mulai kuis dengan 1x Free Aegis Shield (Perisai)',
    startBuff: 'shield'
  },
  {
    id: 'astro-ninja',
    name: 'Astro Ninja',
    role: 'Ninja Kecepatan',
    icon: '🥷',
    passiveText: 'Mulai kuis dengan 1x Free Double Surge (Poin 2x)',
    startBuff: 'double_surge'
  },
  {
    id: 'pixel-fox',
    name: 'Pixel Fox',
    role: 'Pintar & Cerdik',
    icon: '🦊',
    passiveText: 'Mulai kuis dengan 1x Free 50:50 Sonar',
    startBuff: 'fifty_fifty'
  },
  {
    id: 'neon-alchemist',
    name: 'Neon Alchemist',
    role: 'Pakar Waktu',
    icon: '🧪',
    passiveText: 'Mulai kuis dengan 1x Free Chronos Freeze (Waktu)',
    startBuff: 'freeze'
  }
];

class BuffManager {
  constructor() {
    this.inventory = []; // Array of buff IDs
    this.activeBuffs = new Set(); // Buffs currently applied to the current question
    this.coins = 150; // Starting student coins
    this.usedBuffsLog = [];
  }

  resetForNewGame(avatarId) {
    this.inventory = [];
    this.activeBuffs.clear();
    this.coins = 150;
    this.usedBuffsLog = [];

    // Apply avatar passive initial buff
    const character = AVATAR_CHARACTERS.find(c => c.id === avatarId);
    if (character && character.startBuff && BUFF_DEFINITIONS[character.startBuff]) {
      this.inventory.push(character.startBuff);
    }
  }

  getBuffDefinition(id) {
    return BUFF_DEFINITIONS[id] || null;
  }

  getAllDefinitions() {
    return Object.values(BUFF_DEFINITIONS);
  }

  addBuffToInventory(buffId) {
    if (BUFF_DEFINITIONS[buffId]) {
      this.inventory.push(buffId);
      return true;
    }
    return false;
  }

  useBuff(buffId) {
    const idx = this.inventory.indexOf(buffId);
    if (idx === -1) return false;

    // Check if already active for this question
    if (this.activeBuffs.has(buffId)) return false;

    // Remove from inventory
    this.inventory.splice(idx, 1);
    this.activeBuffs.add(buffId);
    this.usedBuffsLog.push(BUFF_DEFINITIONS[buffId].name);

    if (window.soundEngine) {
      window.soundEngine.playBuff();
    }
    return true;
  }

  isBuffActive(buffId) {
    return this.activeBuffs.has(buffId);
  }

  consumeActiveBuff(buffId) {
    this.activeBuffs.delete(buffId);
  }

  clearQuestionBuffs() {
    // Keep persistent buffs if any, or clear for next question
    this.activeBuffs.clear();
  }

  getRandomBuff() {
    const keys = Object.keys(BUFF_DEFINITIONS);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return BUFF_DEFINITIONS[randomKey];
  }

  getThreeRandomBuffs() {
    const keys = [...Object.keys(BUFF_DEFINITIONS)];
    // Shuffle
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    return keys.slice(0, 3).map(k => BUFF_DEFINITIONS[k]);
  }

  buyBuff(buffId) {
    const buff = BUFF_DEFINITIONS[buffId];
    if (!buff) return { success: false, message: 'Buff tidak ditemukan!' };
    if (this.coins < buff.cost) {
      return { success: false, message: 'Koin tidak cukup! Butuh ' + buff.cost + ' koin.' };
    }
    this.coins -= buff.cost;
    this.inventory.push(buffId);
    if (window.soundEngine) window.soundEngine.playCoin();
    return { success: true, message: `Berhasil membeli ${buff.name}!` };
  }

  addCoins(amount) {
    this.coins += amount;
    if (window.soundEngine) window.soundEngine.playCoin();
  }
}

window.buffManager = new BuffManager();
window.AVATAR_CHARACTERS = AVATAR_CHARACTERS;
window.BUFF_DEFINITIONS = BUFF_DEFINITIONS;
