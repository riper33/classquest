/**
 * Multiplayer Client Controller - ClassQuest Online Live Arena
 * Menghubungkan siswa dan guru via WebSocket:
 * - Host Room (Guru): Tampilan proyektor, PIN room, live peserta, toggle acak soal & opsi, live leaderboard.
 * - Player Room (Siswa): Masuk dengan PIN, menerima soal acak (soal & opsi berbeda antar orang), sync skor & streak.
 */

class MultiplayerManager {
  constructor() {
    this.ws = null;
    this.isHost = false;
    this.currentRoomCode = null;
    this.playerId = null;
    this.roomSettings = {};
    
    // Player game state in multiplayer
    this.playerQuestions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.correctCount = 0;
    this.timerInterval = null;
    this.timeLeft = 20;
    this.isFrozen = false;
    this.answeredCurrent = false;
  }

  connect(callback) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      if (callback) callback();
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    this.ws = new WebSocket(`${protocol}//${host}`);

    this.ws.onopen = () => {
      console.log('✅ Terhubung ke Server Multiplayer ClassQuest!');
      if (callback) callback();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleServerMessage(data);
      } catch (e) {
        console.error('Error parsing WS message:', e);
      }
    };

    this.ws.onclose = () => {
      console.log('Koneksi server multiplayer ditutup.');
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket Error:', err);
      alert('Gagal terhubung ke server multiplayer. Pastikan server Node.js aktif.');
    };
  }

  // ==========================================
  // HOST ACTIONS (GURU)
  // ==========================================
  createRoom(quizId, settings) {
    const quiz = window.storageManager.getQuizById(quizId);
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      alert('Kuis tidak memiliki soal! Silakan pilih kuis yang sudah berisi soal.');
      return;
    }

    this.connect(() => {
      this.isHost = true;
      this.ws.send(JSON.stringify({
        type: 'HOST_CREATE_ROOM',
        quizData: quiz,
        settings: settings
      }));
    });
  }

  hostStartGame() {
    if (!this.ws || !this.isHost || !this.currentRoomCode) return;
    this.ws.send(JSON.stringify({
      type: 'HOST_START_GAME'
    }));
  }

  hostEndGame() {
    if (!this.ws || !this.isHost || !this.currentRoomCode) return;
    this.ws.send(JSON.stringify({
      type: 'HOST_END_GAME'
    }));
  }

  // ==========================================
  // PLAYER ACTIONS (SISWA)
  // ==========================================
  joinRoom(roomCode, playerName, avatar) {
    if (!roomCode || roomCode.length < 5) {
      alert('Masukkan 6-digit Game PIN yang valid dari guru!');
      return;
    }

    this.connect(() => {
      this.isHost = false;
      this.ws.send(JSON.stringify({
        type: 'PLAYER_JOIN',
        roomCode: roomCode.trim(),
        playerName: playerName.trim() || 'Peserta',
        avatar: avatar
      }));
    });
  }

  playerSubmitAnswer(isCorrect, pointsEarned, streak, isFinished) {
    if (!this.ws || !this.currentRoomCode) return;

    this.ws.send(JSON.stringify({
      type: 'PLAYER_SUBMIT_ANSWER',
      isCorrect: isCorrect,
      pointsEarned: pointsEarned,
      streak: streak,
      isFinished: isFinished
    }));
  }

  // ==========================================
  // SERVER MESSAGE DISPATCHER
  // ==========================================
  handleServerMessage(data) {
    switch (data.type) {
      // 1. Room Berhasil Dibuat oleh Guru
      case 'ROOM_CREATED':
        this.currentRoomCode = data.roomCode;
        this.roomSettings = data.settings;
        this.renderHostLobbyScreen(data.roomCode, data.quizTitle, data.settings, data.serverIPs);
        break;

      // 2. Siswa Berhasil Join Room
      case 'JOINED_SUCCESS':
        this.currentRoomCode = data.roomCode;
        this.playerId = data.playerId;
        this.renderPlayerWaitingScreen(data.roomCode, data.quizTitle);
        break;

      case 'JOIN_ERROR':
        alert(data.message);
        break;

      // 3. Update Daftar Peserta di Lobby
      case 'LOBBY_PLAYERS_UPDATE':
        this.updateLobbyParticipantsUI(data.players, data.totalJoined);
        break;

      // 4. Guru Mengklik Mulai: Siswa Menerima Soal Acak
      case 'GAME_STARTED':
        this.playerQuestions = data.questions;
        this.roomSettings = data.settings;
        this.startStudentMultiplayerMatch();
        break;

      // 4B. Tampilan Proyektor Guru saat Game Dimulai
      case 'GAME_STARTED_FOR_HOST':
        this.renderHostLiveMatchScreen(data.totalQuestions, data.playerCount);
        break;

      // 5. Update Leaderboard Live Real-Time
      case 'LEADERBOARD_UPDATE':
        this.updateLiveLeaderboardUI(data.leaderboard);
        break;

      // 6. Seluruh Siswa Selesai
      case 'ALL_PLAYERS_FINISHED':
        if (window.soundEngine) window.soundEngine.playFanfare();
        if (window.triggerConfetti) window.triggerConfetti();
        this.renderPodiumFinishScreen();
        break;

      case 'HOST_DISCONNECTED':
        alert(data.message);
        if (window.switchView) window.switchView('lobby');
        break;
    }
  }

  // ==========================================
  // UI RENDERERS FOR MULTIPLAYER
  // ==========================================

  // Guru: Layar Proyektor Lobby Kelas Menunggu Siswa
  renderHostLobbyScreen(roomCode, quizTitle, settings, serverIPs) {
    document.getElementById('mp-setup-section').classList.add('hidden');
    document.getElementById('mp-player-waiting').classList.add('hidden');
    document.getElementById('mp-student-game').classList.add('hidden');
    document.getElementById('mp-host-live').classList.add('hidden');

    const hostLobby = document.getElementById('mp-host-lobby');
    hostLobby.classList.remove('hidden');

    document.getElementById('host-pin-display').textContent = roomCode;
    document.getElementById('host-quiz-title').textContent = quizTitle;

    // Tampilkan IP lokal untuk browser siswa
    const ipHint = document.getElementById('host-ip-hint');
    if (ipHint) {
      if (serverIPs && serverIPs.length > 0) {
        ipHint.textContent = `http://${serverIPs[0]}:5173`;
      } else {
        const host = window.location.hostname || 'localhost';
        ipHint.textContent = `http://${host}:5173`;
      }
    }

    // Tampilkan status anti-contek (acak soal & opsi)
    const tagsContainer = document.getElementById('host-settings-tags');
    if (tagsContainer) {
      tagsContainer.innerHTML = `
        <span class="setting-tag ${settings.shuffleQuestions ? 'tag-active' : ''}">
          🔀 ${settings.shuffleQuestions ? 'Urutan Soal Diacak Beda Tiap Siswa' : 'Urutan Soal Sama'}
        </span>
        <span class="setting-tag ${settings.shuffleOptions ? 'tag-active' : ''}">
          🎲 ${settings.shuffleOptions ? 'Pilihan Opsi A-D Diacak' : 'Pilihan Opsi Normal'}
        </span>
        <span class="setting-tag">⏱️ ${settings.timePerQuestion}s per soal</span>
      `;
    }

    const btnStart = document.getElementById('btn-host-start-game');
    if (btnStart) {
      btnStart.onclick = () => this.hostStartGame();
    }
  }

  // Siswa: Layar Menunggu Guru Mulai
  renderPlayerWaitingScreen(roomCode, quizTitle) {
    document.getElementById('mp-setup-section').classList.add('hidden');
    document.getElementById('mp-host-lobby').classList.add('hidden');
    document.getElementById('mp-student-game').classList.add('hidden');
    document.getElementById('mp-host-live').classList.add('hidden');

    const waitingScreen = document.getElementById('mp-player-waiting');
    waitingScreen.classList.remove('hidden');

    document.getElementById('player-waiting-pin').textContent = roomCode;
    document.getElementById('player-waiting-quiz').textContent = quizTitle;

    // Render my customized avatar
    const myAvatarSpot = document.getElementById('player-waiting-avatar');
    if (myAvatarSpot && window.avatarManager) {
      myAvatarSpot.innerHTML = window.avatarManager.renderAvatarHTML(null, 'lg');
    }
  }

  // Update daftar kartu avatar peserta di lobby
  updateLobbyParticipantsUI(players, count) {
    const hostList = document.getElementById('host-participants-grid');
    const hostCountEl = document.getElementById('host-joined-count');
    if (hostCountEl) hostCountEl.textContent = count;

    if (hostList) {
      hostList.innerHTML = '';
      if (players.length === 0) {
        hostList.innerHTML = '<div class="no-students-notice">Menunggu siswa memasukkan Game PIN di HP/laptop masing-masing...</div>';
      } else {
        players.forEach(p => {
          const item = document.createElement('div');
          item.className = 'participant-card glass-panel';
          const avatarHtml = window.avatarManager ? window.avatarManager.renderAvatarHTML(p.avatar, 'sm') : '👤';
          item.innerHTML = `
            ${avatarHtml}
            <span class="p-name">${this.escapeHtml(p.name)}</span>
          `;
          hostList.appendChild(item);
        });
      }
    }

    // Siswa juga bisa melihat counter peserta yang sudah join
    const waitingCounter = document.getElementById('player-waiting-count');
    if (waitingCounter) {
      waitingCounter.textContent = `${count} Teman Sekelas Telah Bergabung`;
    }
  }

  // Guru: Layar Proyektor Pertandingan Live Kelas
  renderHostLiveMatchScreen(totalQuestions, playerCount) {
    document.getElementById('mp-host-lobby').classList.add('hidden');
    const hostLive = document.getElementById('mp-host-live');
    hostLive.classList.remove('hidden');

    document.getElementById('host-live-pin').textContent = this.currentRoomCode;
    document.getElementById('host-live-qtotal').textContent = `${totalQuestions} Soal`;
    document.getElementById('host-live-pcount').textContent = `${playerCount} Siswa Bertanding`;

    const btnEnd = document.getElementById('btn-host-end-manually');
    if (btnEnd) {
      btnEnd.onclick = () => {
        if (confirm('Selesaikan kuis untuk seluruh kelas sekarang?')) {
          this.hostEndGame();
        }
      };
    }
  }

  // Siswa: Memulai ronde kuis online dengan kumpulan soal uniknya
  startStudentMultiplayerMatch() {
    document.getElementById('mp-player-waiting').classList.add('hidden');
    const studentGame = document.getElementById('mp-student-game');
    studentGame.classList.remove('hidden');

    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.correctCount = 0;

    // Reset inventory buff untuk sesi live online
    if (window.buffManager) {
      window.buffManager.resetForNewGame('cyber-mage');
    }

    this.loadStudentMultiplayerQuestion(0);
  }

  loadStudentMultiplayerQuestion(idx) {
    this.currentIndex = idx;
    this.answeredCurrent = false;
    this.isFrozen = false;

    const q = this.playerQuestions[idx];
    const totalQ = this.playerQuestions.length;
    this.timeLeft = this.roomSettings.timePerQuestion || 20;

    // Render Question
    document.getElementById('mp-q-counter').textContent = `Soal #${q.orderNum} (${idx + 1}/${totalQ})`;
    document.getElementById('mp-q-text').textContent = q.text;

    const hintBox = document.getElementById('mp-oracle-hint-box');
    if (hintBox) hintBox.classList.add('hidden');

    // Options Grid (dengan urutan opsi yang sudah diacak)
    const grid = document.getElementById('mp-options-grid');
    grid.innerHTML = '';
    const optionColors = ['opt-a', 'opt-b', 'opt-c', 'opt-d'];
    const keys = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, optIdx) => {
      const btn = document.createElement('button');
      btn.className = `option-card ${optionColors[optIdx % 4]}`;
      btn.id = `mp-opt-${opt.id}`;
      btn.innerHTML = `
        <span class="option-key-badge">${keys[optIdx]}</span>
        <span class="option-text">${this.escapeHtml(opt.text)}</span>
      `;
      btn.onclick = () => this.handleStudentAnswerSelect(opt.id);
      grid.appendChild(btn);
    });

    // Reset feedback
    const fbBox = document.getElementById('mp-answer-feedback');
    if (fbBox) fbBox.classList.add('hidden');

    // Render Buff Inventory
    this.renderStudentBuffs();

    // Start Timer Bar
    this.startStudentTimer();
  }

  startStudentTimer() {
    clearInterval(this.timerInterval);
    const bar = document.getElementById('mp-timer-bar-fill');
    const text = document.getElementById('mp-timer-text');
    const maxTime = this.roomSettings.timePerQuestion || 20;

    if (bar) {
      bar.style.width = '100%';
      bar.classList.remove('frozen-bar');
    }
    if (text) text.textContent = `${this.timeLeft}s`;

    this.timerInterval = setInterval(() => {
      if (this.isFrozen) return;

      this.timeLeft -= 1;
      const pct = Math.max(0, (this.timeLeft / maxTime) * 100);
      if (bar) bar.style.width = `${pct}%`;
      if (text) text.textContent = `${Math.max(0, this.timeLeft)}s`;

      if (this.timeLeft <= 5 && this.timeLeft > 0 && window.soundEngine) {
        window.soundEngine.playTick();
      }

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.handleStudentTimeout();
      }
    }, 1000);
  }

  handleStudentTimeout() {
    if (this.answeredCurrent) return;
    this.answeredCurrent = true;
    if (window.soundEngine) window.soundEngine.playWrong();
    this.streak = 0;

    const isLast = (this.currentIndex === this.playerQuestions.length - 1);
    this.playerSubmitAnswer(false, 0, 0, isLast);
    this.showStudentFeedback(false, 0, 'Waktu Habis! ⏰', 'Tetap fokus untuk soal berikutnya.', isLast);
  }

  handleStudentAnswerSelect(selectedOptionId) {
    if (this.answeredCurrent) return;
    this.answeredCurrent = true;
    clearInterval(this.timerInterval);

    const q = this.playerQuestions[this.currentIndex];
    const isCorrect = (selectedOptionId === q.correctOptionId);

    let earned = 0;
    if (isCorrect) {
      if (window.soundEngine) window.soundEngine.playCorrect();
      this.correctCount++;
      this.streak++;

      let base = q.points || 1000;
      let speedBonus = Math.round((this.timeLeft / (this.roomSettings.timePerQuestion || 20)) * 500);
      let multiplier = window.buffManager && window.buffManager.isBuffActive('double_surge') ? 2 : 1;
      let streakBonus = this.streak >= 2 ? (this.streak - 1) * 150 : 0;

      earned = (base + speedBonus) * multiplier + streakBonus;
      this.score += earned;

      const btn = document.getElementById(`mp-opt-${selectedOptionId}`);
      if (btn) btn.classList.add('opt-correct');
    } else {
      if (window.soundEngine) window.soundEngine.playWrong();
      this.streak = 0;

      const wrongBtn = document.getElementById(`mp-opt-${selectedOptionId}`);
      if (wrongBtn) wrongBtn.classList.add('opt-wrong');

      const correctBtn = document.getElementById(`mp-opt-${q.correctOptionId}`);
      if (correctBtn) correctBtn.classList.add('opt-correct');
    }

    const isLast = (this.currentIndex === this.playerQuestions.length - 1);

    // Kirim update ke server secara real-time via WebSocket
    this.playerSubmitAnswer(isCorrect, earned, this.streak, isLast);

    this.showStudentFeedback(
      isCorrect,
      earned,
      isCorrect ? `BENAR! +${earned} Pts 🔥` : 'KURANG TEPAT! ❌',
      q.explanation || 'Pembahasan telah dicatat.',
      isLast
    );
  }

  showStudentFeedback(isCorrect, earned, title, explanation, isLast) {
    const box = document.getElementById('mp-answer-feedback');
    if (!box) return;

    box.className = `feedback-box ${isCorrect ? 'fb-correct' : 'fb-wrong'}`;
    box.innerHTML = `
      <div class="feedback-header">
        <span class="fb-icon">${isCorrect ? '✨' : '⚠️'}</span>
        <h3 class="fb-title">${title}</h3>
      </div>
      <p class="fb-explanation">${this.escapeHtml(explanation)}</p>
      <button id="btn-mp-next-q" class="btn-primary-action">
        ${isLast ? 'Selesai & Lihat Skor Akhir ➔' : 'Soal Berikutnya ➔'}
      </button>
    `;
    box.classList.remove('hidden');

    const nextBtn = document.getElementById('btn-mp-next-q');
    if (nextBtn) {
      nextBtn.onclick = () => {
        if (!isLast) {
          this.loadStudentMultiplayerQuestion(this.currentIndex + 1);
        } else {
          document.getElementById('mp-student-game').classList.add('hidden');
          document.getElementById('mp-student-finished-notice').classList.remove('hidden');
        }
      };
    }
  }

  renderStudentBuffs() {
    const container = document.getElementById('mp-buff-inventory-cards');
    if (!container || !window.buffManager) return;
    container.innerHTML = '';

    window.buffManager.inventory.forEach(buffId => {
      const def = window.buffManager.getBuffDefinition(buffId);
      if (!def) return;
      const card = document.createElement('button');
      card.className = 'buff-card-btn';
      card.style.borderColor = def.color;
      card.innerHTML = `
        <span class="buff-icon">${def.icon}</span>
        <div class="buff-info">
          <span class="buff-name">${def.name}</span>
          <span class="buff-tag">${def.tag}</span>
        </div>
      `;
      card.onclick = () => {
        window.buffManager.useBuff(buffId);
        this.renderStudentBuffs();
        if (buffId === 'freeze') {
          this.isFrozen = true;
          const bar = document.getElementById('mp-timer-bar-fill');
          if (bar) bar.classList.add('frozen-bar');
          setTimeout(() => {
            this.isFrozen = false;
            if (bar) bar.classList.remove('frozen-bar');
          }, 15000);
        }
      };
      container.appendChild(card);
    });
  }

  // Update Live Leaderboard Tabel & Podium
  updateLiveLeaderboardUI(leaderboard) {
    // 1. Update Proyektor Guru
    const hostTbody = document.getElementById('host-live-leaderboard-body');
    if (hostTbody) {
      hostTbody.innerHTML = '';
      leaderboard.forEach((p, idx) => {
        const tr = document.createElement('tr');
        if (idx === 0) tr.className = 'row-first-place';
        else if (idx === 1) tr.className = 'row-second-place';
        else if (idx === 2) tr.className = 'row-third-place';

        const rankBadge = idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `#${idx + 1}`;
        const avatarHtml = window.avatarManager ? window.avatarManager.renderAvatarHTML(p.avatar, 'sm') : '👤';

        tr.innerHTML = `
          <td><strong>${rankBadge}</strong></td>
          <td>
            <div style="display:flex;align-items:center;gap:0.5rem;">
              ${avatarHtml}
              <strong>${this.escapeHtml(p.name)}</strong>
            </div>
          </td>
          <td><strong style="color:var(--accent-gold);">${p.score.toLocaleString('id-ID')}</strong></td>
          <td>${p.streak}x 🔥</td>
          <td>${p.accuracy}%</td>
          <td><span class="progress-pill ${p.isFinished ? 'prog-done' : ''}">${p.isFinished ? '✓ Selesai' : p.progress}</span></td>
        `;
        hostTbody.appendChild(tr);
      });
    }

    // 2. Update Mini Standing di Layar Siswa
    const studentList = document.getElementById('mp-live-classmates-list');
    if (studentList) {
      studentList.innerHTML = '';
      leaderboard.slice(0, 5).forEach((p, idx) => {
        const li = document.createElement('li');
        li.className = `classmate-item ${p.id === this.playerId ? 'is-player-item' : ''}`;
        const avatarHtml = window.avatarManager ? window.avatarManager.renderAvatarHTML(p.avatar, 'sm') : '👤';
        li.innerHTML = `
          <div style="display:flex;align-items:center;gap:0.4rem;">
            <span class="rank-pos">#${idx + 1}</span>
            ${avatarHtml}
            <span class="c-name">${this.escapeHtml(p.name)} ${p.id === this.playerId ? '(Kamu)' : ''}</span>
          </div>
          <span class="c-score">${p.score.toLocaleString('id-ID')}</span>
        `;
        studentList.appendChild(li);
      });
    }
  }

  // Tampilkan Podium Juara Akhir
  renderPodiumFinishScreen() {
    const finishScreen = document.getElementById('mp-final-podium-view');
    if (!finishScreen) return;

    document.getElementById('mp-host-live').classList.add('hidden');
    document.getElementById('mp-student-game').classList.add('hidden');
    document.getElementById('mp-student-finished-notice').classList.add('hidden');
    finishScreen.classList.remove('hidden');
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

window.multiplayerManager = new MultiplayerManager();
