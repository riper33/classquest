/**
 * Main Application Coordinator & View Router
 */

// Confetti Particle System
class ConfettiCannon {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animId = null;
    this.colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];
    
    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(count = 120) {
    if (!this.canvas || !this.ctx) return;
    this.resize();

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.7) * 22,
        size: Math.random() * 8 + 4,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008
      });
    }

    if (!this.animId) {
      this.loop();
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.animId = null;
    }
  }
}

window.confetti = new ConfettiCannon('confetti-canvas');
window.triggerConfetti = () => {
  if (window.confetti) window.confetti.burst(150);
};

// Global App Initialization
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupSoundToggle();
  setupAvatarSelector();
  renderLobbyQuizList();
  renderBuffDepot();

  // Initialize Sub-controllers
  if (window.adminController) window.adminController.init();
  if (window.leaderboardController) window.leaderboardController.init();

  // Initialize Avatar & Wardrobe Shop
  if (window.avatarManager) {
    window.avatarManager.updatePointsDisplay();
    setupShopTabs();
  }

  // Initialize Multiplayer Listeners
  setupMultiplayerListeners();

  // Handle Play Quiz button in Lobby
  const btnStartLobby = document.getElementById('btn-start-lobby-game');
  if (btnStartLobby) {
    btnStartLobby.onclick = () => {
      const studentName = document.getElementById('lobby-student-name').value.trim();
      const selectedQuizId = document.getElementById('lobby-quiz-select').value;
      const selectedAvatar = document.querySelector('.avatar-opt-card.selected')?.dataset.avatarId || 'cyber-mage';

      if (!studentName) {
        alert('Harap masukkan nama siswa terlebih dahulu!');
        document.getElementById('lobby-student-name').focus();
        return;
      }

      if (!selectedQuizId) {
        alert('Pilih kuis yang ingin dimainkan!');
        return;
      }

      // Hide other screens, show game screen
      switchView('game');
      window.gameController.startQuiz(selectedQuizId, studentName, selectedAvatar);
    };
  }

  // Handle Victory Screen Buttons
  const btnVicPlayAgain = document.getElementById('btn-vic-play-again');
  if (btnVicPlayAgain) {
    btnVicPlayAgain.onclick = () => {
      document.getElementById('victory-screen').classList.add('hidden');
      switchView('lobby');
    };
  }

  const btnVicLeaderboard = document.getElementById('btn-vic-leaderboard');
  if (btnVicLeaderboard) {
    btnVicLeaderboard.onclick = () => {
      document.getElementById('victory-screen').classList.add('hidden');
      switchView('leaderboard');
    };
  }

  const btnVicShop = document.getElementById('btn-vic-shop');
  if (btnVicShop) {
    btnVicShop.onclick = () => {
      document.getElementById('victory-screen').classList.add('hidden');
      switchView('shop');
    };
  }
});

// Setup Wardrobe / Avatar Shop Tabs
function setupShopTabs() {
  const tabBtns = document.querySelectorAll('.shop-cat-btn');
  tabBtns.forEach(btn => {
    btn.onclick = () => {
      const cat = btn.dataset.category;
      if (window.avatarManager) {
        window.avatarManager.renderShopCategory(cat);
        if (window.soundEngine) window.soundEngine.playTick();
      }
    };
  });
}

// View Navigation Switcher
function setupNavigation() {
  const navBtns = document.querySelectorAll('[data-nav-target]');
  navBtns.forEach(btn => {
    btn.onclick = () => {
      const target = btn.dataset.navTarget;
      switchView(target);
    };
  });
}

function switchView(viewName) {
  // Views: 'lobby', 'game', 'admin', 'leaderboard', 'buffs', 'shop', 'multiplayer'
  const views = {
    lobby: document.getElementById('lobby-view'),
    game: document.getElementById('game-screen'),
    admin: document.getElementById('admin-view'),
    leaderboard: document.getElementById('leaderboard-view'),
    buffs: document.getElementById('buff-depot-view'),
    shop: document.getElementById('avatar-shop-view'),
    multiplayer: document.getElementById('multiplayer-view')
  };

  // Ensure victory screen is hidden when switching to any view
  const victoryScreen = document.getElementById('victory-screen');
  if (victoryScreen && viewName !== 'game') {
    victoryScreen.classList.add('hidden');
  }

  // If leaving game screen, stop active game timer
  if (viewName !== 'game' && window.gameController && window.gameController.timerInterval) {
    clearInterval(window.gameController.timerInterval);
  }

  Object.keys(views).forEach(k => {
    if (views[k]) {
      if (k === viewName) {
        views[k].classList.remove('hidden');
      } else {
        views[k].classList.add('hidden');
      }
    }
  });

  // Update Nav Active States
  document.querySelectorAll('[data-nav-target]').forEach(btn => {
    if (btn.dataset.navTarget === viewName) {
      btn.classList.add('nav-active');
    } else {
      btn.classList.remove('nav-active');
    }
  });

  // Special refresh hooks
  if (viewName === 'leaderboard' && window.leaderboardController) {
    window.leaderboardController.renderLeaderboard();
  }
  if (viewName === 'admin' && window.adminController) {
    window.adminController.renderQuizList();
  }
  if (viewName === 'lobby') {
    renderLobbyQuizList();
    renderLobbyAvatarPreview();
  }
  if (viewName === 'shop' && window.avatarManager) {
    window.avatarManager.renderAvatarPreview('shop-avatar-large-preview');
    window.avatarManager.renderShopCategory(window.avatarManager.currentCategory || 'head');
    window.avatarManager.updatePointsDisplay();
  }
  if (viewName === 'multiplayer') {
    refreshMultiplayerHub();
  }
}

// Multiplayer Event Listeners & Hub Refresh
function setupMultiplayerListeners() {
  // 1. Host Create Room
  const btnCreateRoom = document.getElementById('btn-mp-create-room');
  if (btnCreateRoom) {
    btnCreateRoom.onclick = () => {
      const select = document.getElementById('mp-select-quiz');
      const quizId = select ? select.value : null;
      const shuffleQ = document.getElementById('mp-toggle-shuffle-q')?.checked ?? true;
      const shuffleOpt = document.getElementById('mp-toggle-shuffle-opt')?.checked ?? true;
      const timerSec = parseInt(document.getElementById('mp-input-timer')?.value, 10) || 20;

      if (!quizId) {
        alert('Pilih kuis yang ingin dimainkan terlebih dahulu!');
        return;
      }

      if (window.multiplayerManager) {
        window.multiplayerManager.createRoom(quizId, {
          shuffleQuestions: shuffleQ,
          shuffleOptions: shuffleOpt,
          timerSeconds: timerSec
        });
      }
    };
  }

  // 2. Student Join Room
  const btnJoinRoom = document.getElementById('btn-mp-join-room');
  if (btnJoinRoom) {
    btnJoinRoom.onclick = () => {
      const pin = document.getElementById('mp-input-pin')?.value.trim();
      const name = document.getElementById('mp-input-name')?.value.trim();
      const equippedAvatar = window.avatarManager ? window.avatarManager.getEquipped() : {
        base: 'cyber-mage',
        head: 'wizard-hat',
        outfit: 'cyber-armor',
        face: 'matrix-shades',
        aura: 'void-portal'
      };

      if (!pin) {
        alert('Masukkan 6-digit Game PIN dari proyektor guru!');
        document.getElementById('mp-input-pin')?.focus();
        return;
      }
      if (!name) {
        alert('Harap masukkan nama siswa atau tim kamu!');
        document.getElementById('mp-input-name')?.focus();
        return;
      }

      if (window.multiplayerManager) {
        window.multiplayerManager.joinRoom(pin, name, equippedAvatar);
      }
    };
  }

  // 3. Host Start Game
  const btnHostStart = document.getElementById('btn-host-start-game');
  if (btnHostStart) {
    btnHostStart.onclick = () => {
      if (window.multiplayerManager) {
        window.multiplayerManager.hostStartGame();
      }
    };
  }

  // 4. Host End Game Manually
  const btnHostEnd = document.getElementById('btn-host-end-manually');
  if (btnHostEnd) {
    btnHostEnd.onclick = () => {
      if (confirm('Selesaikan kuis kelas ini dan tampilkan rekap juara sekarang?')) {
        if (window.multiplayerManager) {
          window.multiplayerManager.hostEndGame();
        }
      }
    };
  }
}

function refreshMultiplayerHub() {
  // Populate Quiz Select
  const select = document.getElementById('mp-select-quiz');
  if (select && window.storageManager) {
    const quizzes = window.storageManager.getQuizzes();
    select.innerHTML = '';
    quizzes.forEach(q => {
      const opt = document.createElement('option');
      opt.value = q.id;
      opt.textContent = `${q.title} (${q.questions ? q.questions.length : 0} Soal - ${q.category || 'Umum'})`;
      select.appendChild(opt);
    });
  }

  // Render Student Avatar Preview in Hub
  const studentBadge = document.getElementById('mp-student-avatar-badge');
  if (studentBadge && window.avatarManager) {
    const equipped = window.avatarManager.getEquipped();
    studentBadge.innerHTML = window.avatarManager.renderAvatarHTML(equipped, 'sm');
  }

  // Pre-fill student name from lobby if any
  const lobbyName = document.getElementById('lobby-student-name')?.value.trim();
  const mpInputName = document.getElementById('mp-input-name');
  if (mpInputName && lobbyName && !mpInputName.value) {
    mpInputName.value = lobbyName;
  }
}

// Sound Control
function setupSoundToggle() {
  const btn = document.getElementById('btn-sound-toggle');
  if (!btn) return;

  const updateIcon = (isMuted) => {
    btn.innerHTML = isMuted ? '🔇 <span class="nav-label">Suara: Mati</span>' : '🔊 <span class="nav-label">Suara: Aktif</span>';
  };

  updateIcon(window.soundEngine.muted);

  btn.onclick = () => {
    const isMuted = window.soundEngine.toggleMute();
    updateIcon(isMuted);
  };
}

// Avatar Selector in Lobby
function setupAvatarSelector() {
  const container = document.getElementById('avatar-selection-grid');
  if (!container) return;

  const savedProfile = window.storageManager.getSavedProfile();
  const nameInput = document.getElementById('lobby-student-name');
  if (nameInput && savedProfile.name) {
    nameInput.value = savedProfile.name;
  }

  container.innerHTML = '';

  window.AVATAR_CHARACTERS.forEach(char => {
    const card = document.createElement('div');
    const isSelected = char.id === (savedProfile.avatarId || 'cyber-mage');
    card.className = `avatar-opt-card ${isSelected ? 'selected' : ''}`;
    card.dataset.avatarId = char.id;

    card.innerHTML = `
      <span class="avatar-opt-icon">${char.icon}</span>
      <h4 class="avatar-opt-name">${char.name}</h4>
      <span class="avatar-opt-role">${char.role}</span>
      <p class="avatar-opt-passive">${char.passiveText}</p>
    `;

    card.onclick = () => {
      document.querySelectorAll('.avatar-opt-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      if (window.soundEngine) window.soundEngine.playTick();
    };

    container.appendChild(card);
  });
}

// Lobby Quiz Selection Dropdown
function renderLobbyQuizList() {
  const select = document.getElementById('lobby-quiz-select');
  if (!select) return;

  const quizzes = window.storageManager.getQuizzes();
  select.innerHTML = '';

  if (quizzes.length === 0) {
    select.innerHTML = '<option value="">(Belum ada kuis tersedia - Buat di Menu Guru)</option>';
    return;
  }

  quizzes.forEach(q => {
    const opt = document.createElement('option');
    opt.value = q.id;
    const qCount = q.questions ? q.questions.length : 0;
    opt.textContent = `${q.icon || '🚀'} ${q.title} (${qCount} Soal • ${q.category || 'Umum'})`;
    select.appendChild(opt);
  });
}
window.renderLobbyQuizList = renderLobbyQuizList;

// Buff Depot & Encyclopedia Gallery
function renderBuffDepot() {
  const container = document.getElementById('buff-depot-grid');
  if (!container) return;

  const buffs = window.buffManager.getAllDefinitions();
  container.innerHTML = '';

  buffs.forEach(buff => {
    const card = document.createElement('div');
    card.className = 'buff-depot-card glass-panel';
    card.style.borderColor = buff.color;

    card.innerHTML = `
      <div class="depot-card-top">
        <span class="depot-buff-icon" style="text-shadow: 0 0 16px ${buff.glow}">${buff.icon}</span>
        <div class="depot-buff-meta">
          <h3 class="depot-buff-name" style="color: ${buff.color}">${buff.name}</h3>
          <span class="depot-buff-tag">${buff.tag}</span>
        </div>
      </div>
      <p class="depot-buff-desc">${buff.desc}</p>
      <div class="depot-buff-footer">
        <span class="depot-cost">🪙 ${buff.cost} Koin Toko</span>
        <span class="depot-mechanic">Drop saat Combo Streak 🔥</span>
      </div>
    `;

    container.appendChild(card);
  });
}

// Render Lobby Current Avatar Preview Card
function renderLobbyAvatarPreview() {
  const container = document.getElementById('lobby-avatar-preview-badge');
  if (!container || !window.avatarManager) return;
  const profile = window.avatarManager.getProfile();
  container.innerHTML = `
    <div class="lobby-current-avatar-box glass-panel">
      ${window.avatarManager.renderAvatarHTML(profile.avatar, 'md')}
      <div class="avatar-desc-col">
        <span class="avatar-equipped-title">Pakaian & Aksesoris Saat Ini</span>
        <button type="button" class="btn-open-wardrobe">🎨 Kustomisasi & Toko Aksesoris</button>
      </div>
    </div>
  `;
  const btn = container.querySelector('.btn-open-wardrobe');
  if (btn) {
    btn.onclick = () => switchView('shop');
  }
}
window.renderLobbyAvatarPreview = renderLobbyAvatarPreview;
