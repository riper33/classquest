/**
 * Storage & Data Manager
 * Mengatur LocalStorage untuk Kuis, Soal, dan Rekap Nilai Siswa
 */
const STORAGE_KEYS = {
  QUIZZES: 'qa_quizzes_v2',
  LEADERBOARD: 'qa_leaderboard_v2',
  ACTIVE_PROFILE: 'qa_profile_v2'
};

const DEFAULT_QUIZZES = [
  {
    id: 'quiz-science-space',
    title: 'Penjelajah Antariksa & Sains Galaksi',
    description: 'Uji pengetahuan astronomi, gravitasi, dan misteri tata surya bersama astronot kelas!',
    category: 'Sains',
    icon: '🚀',
    timePerQuestion: 20,
    questions: [
      {
        id: 'q1',
        text: 'Planet manakah di Tata Surya kita yang memiliki waktu rotasi paling cepat (hanya sekitar 10 jam per hari)?',
        options: [
          { id: 'A', text: 'Mars' },
          { id: 'B', text: 'Yupiter' },
          { id: 'C', text: 'Venus' },
          { id: 'D', text: 'Merkurius' }
        ],
        correctOptionId: 'B',
        hint: 'Planet ini adalah raksasa gas terbesar di tata surya kita.',
        explanation: 'Yupiter berputar sangat cepat pada porosnya, hanya membutuhkan waktu sekitar 9 jam 55 menit untuk satu putaran penuh!',
        points: 1000
      },
      {
        id: 'q2',
        text: 'Cahaya dari Matahari membutuhkan waktu sekitar berapa lama untuk sampai ke permukaan Bumi?',
        options: [
          { id: 'A', text: '8 detik' },
          { id: 'B', text: '8 menit' },
          { id: 'C', text: '8 jam' },
          { id: 'D', text: 'Instan (0 detik)' }
        ],
        correctOptionId: 'B',
        hint: 'Jarak Bumi-Matahari sekitar 150 juta km, dan kecepatan cahaya 300.000 km/detik.',
        explanation: 'Cahaya matahari menempuh jarak 149,6 juta km dalam waktu kurang lebih 8 menit 20 detik (sekitar 500 detik).',
        points: 1000
      },
      {
        id: 'q3',
        text: 'Gas apakah yang paling melimpah di atmosfer Planet Bumi yang kita hirup sehari-hari?',
        options: [
          { id: 'A', text: 'Oksigen (O2)' },
          { id: 'B', text: 'Karbon Dioksida (CO2)' },
          { id: 'C', text: 'Nitrogen (N2)' },
          { id: 'D', text: 'Helium (He)' }
        ],
        correctOptionId: 'C',
        hint: 'Mencakup sekitar 78% dari volume total atmosfer bumi.',
        explanation: 'Atmosfer bumi terdiri dari sekitar 78% Nitrogen, 21% Oksigen, dan 1% gas lainnya seperti Argon dan CO2.',
        points: 1000
      },
      {
        id: 'q4',
        text: 'Gaya tarik yang menyebabkan planet-planet tetap berada pada orbitnya mengelilingi matahari disebut...',
        options: [
          { id: 'A', text: 'Gaya Gesek' },
          { id: 'B', text: 'Gaya Magnetik' },
          { id: 'C', text: 'Gaya Gravitasi' },
          { id: 'D', text: 'Gaya Sentrifugal' }
        ],
        correctOptionId: 'C',
        hint: 'Hukum ini pertama kali dirumuskan secara ilmiah oleh Sir Isaac Newton.',
        explanation: 'Gaya gravitasi matahari yang sangat besar menarik planet-planet sehingga mereka bergerak dalam lintasan orbit elips.',
        points: 1000
      },
      {
        id: 'q5',
        text: 'Mengapa baju astronot dirancang kedap udara dan berwarna putih cerah di luar angkasa?',
        options: [
          { id: 'A', text: 'Hanya agar terlihat keren di kamera' },
          { id: 'B', text: 'Memantulkan radiasi panas matahari dan menjaga tekanan tubuh' },
          { id: 'C', text: 'Menyerap oksigen dari luar' },
          { id: 'D', text: 'Menambah berat badan saat berjalan' }
        ],
        correctOptionId: 'B',
        hint: 'Di luar angkasa hampa udara dan radiasi termal dari sinar matahari sangat ekstrem.',
        explanation: 'Warna putih memantulkan radiasi panas matahari, sementara baju bertekanan melindungi astronot dari kehampaan udara luar angkasa.',
        points: 1000
      }
    ]
  },
  {
    id: 'quiz-math-logic',
    title: 'Tantangan Logika & Matematika Kilat',
    description: 'Asah ketangkasan berhitung cepat, pola angka, dan teka-teki logika seru.',
    category: 'Matematika',
    icon: '⚡',
    timePerQuestion: 20,
    questions: [
      {
        id: 'qm1',
        text: 'Berapakah hasil dari operasi hitung: 15 + 5 x 4 - 10?',
        options: [
          { id: 'A', text: '70' },
          { id: 'B', text: '25' },
          { id: 'C', text: '35' },
          { id: 'D', text: '45' }
        ],
        correctOptionId: 'B',
        hint: 'Ingat aturan urutan operasi matematika (KABATAKU: Kali & Bagi didahulukan sebelum Tambah & Kurang).',
        explanation: 'Hitung perkalian dulu: 5 x 4 = 20. Lalu: 15 + 20 - 10 = 35 - 10 = 25.',
        points: 1000
      },
      {
        id: 'qm2',
        text: 'Perhatikan deret pola angka berikut: 3, 7, 15, 31, ... Angka berikutnya adalah?',
        options: [
          { id: 'A', text: '63' },
          { id: 'B', text: '62' },
          { id: 'C', text: '59' },
          { id: 'D', text: '65' }
        ],
        correctOptionId: 'A',
        hint: 'Pola selisihnya: +4, +8, +16, +(...) atau (Angka x 2) + 1.',
        explanation: '(31 x 2) + 1 = 63. Atau dengan selisih yang berlipat ganda: 31 + 32 = 63.',
        points: 1000
      },
      {
        id: 'qm3',
        text: 'Sebuah segitiga memiliki alas 12 cm dan tinggi 8 cm. Berapakah luas segitiga tersebut?',
        options: [
          { id: 'A', text: '96 cm²' },
          { id: 'B', text: '48 cm²' },
          { id: 'C', text: '24 cm²' },
          { id: 'D', text: '54 cm²' }
        ],
        correctOptionId: 'B',
        hint: 'Rumus luas segitiga adalah 1/2 x alas x tinggi.',
        explanation: 'Luas = 1/2 x 12 x 8 = 6 x 8 = 48 cm².',
        points: 1000
      },
      {
        id: 'qm4',
        text: 'Jika 3 ekor kucing dapat menangkap 3 tikus dalam 3 menit, berapa lama waktu yang dibutuhkan 100 kucing untuk menangkap 100 tikus?',
        options: [
          { id: 'A', text: '100 menit' },
          { id: 'B', text: '30 menit' },
          { id: 'C', text: '3 menit' },
          { id: 'D', text: '1 menit' }
        ],
        correctOptionId: 'C',
        hint: 'Pikirkan tingkat produktivitas per ekor kucing secara paralel!',
        explanation: 'Tiap 1 kucing butuh 3 menit untuk menangkap 1 tikus. Jika 100 kucing berburu 100 tikus secara bersamaan, mereka tetap selesai dalam 3 menit!',
        points: 1000
      }
    ]
  },
  {
    id: 'quiz-tech-ai',
    title: 'Dunia Coding, Komputer & Kecerdasan Buatan (AI)',
    description: 'Kenali dasar teknologi digital, internet, coding, dan algoritma masa depan.',
    category: 'Teknologi',
    icon: '💻',
    timePerQuestion: 20,
    questions: [
      {
        id: 'qt1',
        text: 'Bahasa pemrograman manakah yang berjalan langsung di browser untuk membuat halaman web menjadi interaktif?',
        options: [
          { id: 'A', text: 'Python' },
          { id: 'B', text: 'JavaScript' },
          { id: 'C', text: 'C++' },
          { id: 'D', text: 'SQL' }
        ],
        correctOptionId: 'B',
        hint: 'Bahasa ini dibuat oleh Brendan Eich pada tahun 1995 dan menjadi standar web modern.',
        explanation: 'JavaScript adalah bahasa pemrograman resmi web yang dieksekusi langsung oleh mesin browser seperti V8.',
        points: 1000
      },
      {
        id: 'qt2',
        text: 'Komponen perangkat keras komputer yang sering disebut sebagai "Otak Komputer" adalah...',
        options: [
          { id: 'A', text: 'RAM' },
          { id: 'B', text: 'Hard Disk / SSD' },
          { id: 'C', text: 'CPU (Processor)' },
          { id: 'D', text: 'Power Supply' }
        ],
        correctOptionId: 'C',
        hint: 'CPU adalah singkatan dari Central Processing Unit.',
        explanation: 'CPU bertugas mengeksekusi instruksi program dan melakukan pemrosesan data utama pada komputer.',
        points: 1000
      },
      {
        id: 'qt3',
        text: 'Apa kepanjangan dari AI dalam teknologi masa kini?',
        options: [
          { id: 'A', text: 'Automated Internet' },
          { id: 'B', text: 'Artificial Intelligence' },
          { id: 'C', text: 'Advanced Interface' },
          { id: 'D', text: 'Algorithm Information' }
        ],
        correctOptionId: 'B',
        hint: 'Kecerdasan Buatan dalam bahasa Inggris.',
        explanation: 'Artificial Intelligence (AI) mengacu pada simulasi kecerdasan manusia dalam mesin yang diprogram untuk berpikir dan belajar.',
        points: 1000
      }
    ]
  }
];

class StorageManager {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.QUIZZES)) {
      this.saveQuizzes(DEFAULT_QUIZZES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEADERBOARD)) {
      // Seed some friendly starter bot scores for classroom competition feel
      const starterScores = [
        {
          id: 'score-seed-1',
          quizId: 'quiz-science-space',
          quizTitle: 'Penjelajah Antariksa & Sains Galaksi',
          studentName: 'Ahmad Faiz (Juara Kelas)',
          avatar: { base: 'base-mage', head: 'head-crown', outfit: 'outfit-robe', face: 'face-thug', aura: 'aura-wings' },
          score: 5850,
          accuracy: 100,
          streakMax: 5,
          timeElapsed: 42,
          buffsUsed: ['50:50 Eliminator', 'Double Surge'],
          timestamp: Date.now() - 3600000 * 4
        },
        {
          id: 'score-seed-2',
          quizId: 'quiz-science-space',
          quizTitle: 'Penjelajah Antariksa & Sains Galaksi',
          studentName: 'Siti Rahma',
          avatar: { base: 'base-ninja', head: 'head-vr', outfit: 'outfit-cyber', face: 'face-star', aura: 'aura-thunder' },
          score: 4720,
          accuracy: 80,
          streakMax: 4,
          timeElapsed: 55,
          buffsUsed: ['Aegis Shield'],
          timestamp: Date.now() - 3600000 * 8
        },
        {
          id: 'score-seed-3',
          quizId: 'quiz-math-logic',
          quizTitle: 'Tantangan Logika & Matematika Kilat',
          studentName: 'Budi Santoso',
          avatar: { base: 'base-knight', head: 'head-grad', outfit: 'outfit-suit', face: 'face-smart', aura: 'aura-fire' },
          score: 4950,
          accuracy: 100,
          streakMax: 4,
          timeElapsed: 38,
          buffsUsed: ['Freeze Time', 'Double Surge'],
          timestamp: Date.now() - 3600000 * 12
        }
      ];
      this.saveLeaderboard(starterScores);
    }
  }

  getQuizzes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZZES);
      return data ? JSON.parse(data) : DEFAULT_QUIZZES;
    } catch (e) {
      console.error('Error reading quizzes:', e);
      return DEFAULT_QUIZZES;
    }
  }

  saveQuizzes(quizzes) {
    try {
      localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
      return true;
    } catch (e) {
      console.error('Error saving quizzes:', e);
      return false;
    }
  }

  getQuizById(id) {
    const list = this.getQuizzes();
    return list.find(q => q.id === id) || null;
  }

  saveQuiz(quiz) {
    const quizzes = this.getQuizzes();
    const index = quizzes.findIndex(q => q.id === quiz.id);
    if (index >= 0) {
      quizzes[index] = quiz;
    } else {
      quizzes.unshift(quiz);
    }
    this.saveQuizzes(quizzes);
    return quiz;
  }

  deleteQuiz(id) {
    let quizzes = this.getQuizzes();
    quizzes = quizzes.filter(q => q.id !== id);
    this.saveQuizzes(quizzes);
    return true;
  }

  resetDefaultQuizzes() {
    this.saveQuizzes(DEFAULT_QUIZZES);
    return DEFAULT_QUIZZES;
  }

  // Leaderboard
  getLeaderboard() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading leaderboard:', e);
      return [];
    }
  }

  saveLeaderboard(scores) {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(scores));
      return true;
    } catch (e) {
      console.error('Error saving leaderboard:', e);
      return false;
    }
  }

  addScoreRecord(record) {
    const scores = this.getLeaderboard();
    const newRecord = {
      id: 'score-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      ...record,
      timestamp: Date.now()
    };
    scores.unshift(newRecord);
    this.saveLeaderboard(scores);
    return newRecord;
  }

  clearLeaderboard(quizId = null) {
    if (!quizId) {
      this.saveLeaderboard([]);
    } else {
      let scores = this.getLeaderboard();
      scores = scores.filter(s => s.quizId !== quizId);
      this.saveLeaderboard(scores);
    }
  }

  // Profile
  getSavedProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE);
      return data ? JSON.parse(data) : { name: '', avatarId: 'cyber-mage' };
    } catch (e) {
      return { name: '', avatarId: 'cyber-mage' };
    }
  }

  saveProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, JSON.stringify(profile));
    } catch (e) {}
  }
}

window.storageManager = new StorageManager();
