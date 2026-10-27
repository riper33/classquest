/**
 * Game Controller - ClassQuest Arena
 * Mengatur alur permainan siswa, timer, validasi jawaban, efek buff, dan scoring
 */

class GameController {
  constructor() {
    this.currentQuiz = null;
    this.currentQuestionIndex = 0;
    this.studentName = 'Siswa Hebat';
    this.selectedAvatar = 'cyber-mage';
    
    // Game stats
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.correctCount = 0;
    this.startTime = 0;
    this.questionStartTime = 0;
    this.timerInterval = null;
    this.timeLeft = 0;
    this.totalTime = 20;
    this.isFrozen = false;
    this.freezeTimeout = null;
    this.answeredCurrent = false;
    this.secondChanceUsedOnQuestion = false;

    // Simulated classroom classmates for live competition dynamics
    this.mockOpponents = [];
  }

  startQuiz(quizId, studentName, avatarId) {
    const quiz = window.storageManager.getQuizById(quizId);
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      alert('Kuis tidak memiliki soal! Silakan isi soal terlebih dahulu di Menu Guru/Admin.');
      return false;
    }

    this.currentQuiz = JSON.parse(JSON.stringify(quiz));
    this.currentQuestionIndex = 0;
    this.studentName = studentName.trim() || 'Peserta Kelas';
    this.selectedAvatar = avatarId || 'cyber-mage';
    
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.correctCount = 0;
    this.startTime = Date.now();

    // Reset Buff Manager for this session
    window.buffManager.resetForNewGame(this.selectedAvatar);

    // Save student profile preference
    window.storageManager.saveProfile({
      name: this.studentName,
      avatarId: this.selectedAvatar
    });

    // Initialize mock classroom peers
    this.initMockClassmates();

    // Show Countdown screen
    this.showCountdown(() => {
      this.loadQuestion(0);
    });

    return true;
  }

  initMockClassmates() {
    this.mockOpponents = [
      { name: 'Rian Pratama', avatar: { base: 'base-ninja', head: 'head-vr', outfit: 'outfit-cyber', face: 'face-star', aura: 'aura-thunder' }, score: 0, accuracyRate: 0.85 },
      { name: 'Dina Kusuma', avatar: { base: 'base-fox', head: 'head-headphones', outfit: 'outfit-kimono', face: 'face-smart', aura: 'aura-frost' }, score: 0, accuracyRate: 0.75 },
      { name: 'Rafi Al-Fatih', avatar: { base: 'base-knight', head: 'head-tophat', outfit: 'outfit-armor', face: 'face-monocle', aura: 'aura-fire' }, score: 0, accuracyRate: 0.90 }
    ];
  }

  updateMockOpponents() {
    this.mockOpponents.forEach(bot => {
      const isCorrect = Math.random() < bot.accuracyRate;
      if (isCorrect) {
        const added = 700 + Math.floor(Math.random() * 300);
        bot.score += added;
      }
    });
  }

  showCountdown(callback) {
    const overlay = document.getElementById('countdown-overlay');
    const numEl = document.getElementById('countdown-number');
    if (!overlay || !numEl) {
      callback();
      return;
    }

    overlay.classList.remove('hidden');
    let count = 3;
    numEl.textContent = count;
    if (window.soundEngine) window.soundEngine.playTick();

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        numEl.textContent = count;
        numEl.classList.remove('pulse-anim');
        void numEl.offsetWidth; // trigger reflow
        numEl.classList.add('pulse-anim');
        if (window.soundEngine) window.soundEngine.playTick();
      } else if (count === 0) {
        numEl.textContent = 'MULAI! 🚀';
        if (window.soundEngine) window.soundEngine.playCorrect();
      } else {
        clearInterval(interval);
        overlay.classList.add('hidden');
        callback();
      }
    }, 850);
  }

  loadQuestion(index) {
    this.currentQuestionIndex = index;
    this.answeredCurrent = false;
    this.secondChanceUsedOnQuestion = false;
    this.isFrozen = false;
    if (this.freezeTimeout) clearTimeout(this.freezeTimeout);

    // Clear buffs active from previous question
    window.buffManager.clearQuestionBuffs();

    const q = this.currentQuiz.questions[index];
    this.totalTime = this.currentQuiz.timePerQuestion || 20;
    this.timeLeft = this.totalTime;
    this.questionStartTime = Date.now();

    // Render Question in UI
    this.renderQuestionUI(q);
    this.renderInventoryBar();
    this.updateHUD();
    this.startTimer();
  }

  renderQuestionUI(question) {
    const totalQ = this.currentQuiz.questions.length;
    document.getElementById('q-counter').textContent = `Soal ${this.currentQuestionIndex + 1} / ${totalQ}`;
    document.getElementById('q-progress-bar').style.width = `${((this.currentQuestionIndex) / totalQ) * 100}%`;
    document.getElementById('q-text').textContent = question.text;

    // Reset aura / shield container styling
    const card = document.getElementById('question-card');
    card.classList.remove('shield-active', 'frozen-card', 'shake-anim', 'glow-green');

    // Hint box reset
    const hintBox = document.getElementById('oracle-hint-box');
    if (hintBox) hintBox.classList.add('hidden');

    // Render Options
    const optionsGrid = document.getElementById('options-grid');
    optionsGrid.innerHTML = '';

    const optionColors = ['opt-a', 'opt-b', 'opt-c', 'opt-d'];
    const letterKey = ['A', 'B', 'C', 'D'];

    question.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = `option-card ${optionColors[idx % 4]}`;
      btn.id = `option-${opt.id}`;
      btn.dataset.optionId = opt.id;

      btn.innerHTML = `
        <span class="option-key-badge">${letterKey[idx] || opt.id}</span>
        <span class="option-text">${this.escapeHtml(opt.text)}</span>
      `;

      btn.onclick = () => this.handleAnswerSelect(opt.id);
      optionsGrid.appendChild(btn);
    });

    // Reset feedback section
    const feedbackBox = document.getElementById('answer-feedback-box');
    if (feedbackBox) feedbackBox.classList.add('hidden');
  }

  startTimer() {
    clearInterval(this.timerInterval);
    const timerBar = document.getElementById('timer-bar-fill');
    const timerText = document.getElementById('timer-text');
    
    if (timerBar) {
      timerBar.style.width = '100%';
      timerBar.classList.remove('frozen-bar');
    }
    if (timerText) timerText.textContent = `${this.timeLeft}s`;

    this.timerInterval = setInterval(() => {
      if (this.isFrozen) return; // Time stopped!

      this.timeLeft -= 1;
      const pct = Math.max(0, (this.timeLeft / this.totalTime) * 100);

      if (timerBar) timerBar.style.width = `${pct}%`;
      if (timerText) timerText.textContent = `${Math.max(0, this.timeLeft)}s`;

      if (this.timeLeft <= 5 && this.timeLeft > 0) {
        if (window.soundEngine) window.soundEngine.playTick();
        if (timerBar) timerBar.style.backgroundColor = '#ef4444';
      }

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeOut();
      }
    }, 1000);
  }

  handleTimeOut() {
    if (this.answeredCurrent) return;
    this.answeredCurrent = true;
    if (window.soundEngine) window.soundEngine.playWrong();

    this.streak = 0;
    this.showFeedback(false, null, 'Waktu Habis! ⏰', 'Jangan khawatir, tetap semangat untuk soal berikutnya.');
  }

  handleAnswerSelect(optionId) {
    if (this.answeredCurrent) return;

    const q = this.currentQuiz.questions[this.currentQuestionIndex];
    const isCorrect = optionId === q.correctOptionId;

    // Check Phoenix Rebirth buff if wrong and not yet used
    if (!isCorrect && window.buffManager.isBuffActive('second_chance') && !this.secondChanceUsedOnQuestion) {
      this.secondChanceUsedOnQuestion = true;
      window.buffManager.consumeActiveBuff('second_chance');
      this.renderInventoryBar();

      // Mark the wrong button disabled
      const wrongBtn = document.getElementById(`option-${optionId}`);
      if (wrongBtn) {
        wrongBtn.classList.add('opt-wrong', 'opt-disabled');
        wrongBtn.disabled = true;
      }
      if (window.soundEngine) window.soundEngine.playBuff();
      this.showToast('🔄 PHOENIX REBIRTH! Kesempatan kedua aktif, pilih opsi lain!', 'info');
      return;
    }

    this.answeredCurrent = true;
    clearInterval(this.timerInterval);

    // Calculate score
    if (isCorrect) {
      this.handleCorrectAnswer(q, optionId);
    } else {
      this.handleWrongAnswer(q, optionId);
    }

    this.updateMockOpponents();
    this.updateLiveClassStanding();
  }

  handleCorrectAnswer(question, optionId) {
    if (window.soundEngine) window.soundEngine.playCorrect();

    this.correctCount++;
    this.streak++;
    if (this.streak > this.maxStreak) this.maxStreak = this.streak;

    // Base score calculation
    let basePoints = question.points || 1000;
    const speedRatio = Math.max(0, this.timeLeft / this.totalTime);
    let speedBonus = Math.round(speedRatio * 500);

    // Check Buffs
    let buffMultiplier = 1;
    let extraBonus = 0;
    let buffNotes = [];

    // Double Surge
    if (window.buffManager.isBuffActive('double_surge')) {
      buffMultiplier = 2;
      buffNotes.push('⚡ Double Surge x2 Poin!');
    }

    // Jackpot Rush (if within first 5 seconds of answering)
    const timeSpent = (Date.now() - this.questionStartTime) / 1000;
    if (window.buffManager.isBuffActive('jackpot')) {
      if (timeSpent <= 5) {
        extraBonus += 500;
        buffNotes.push('💎 Jackpot Rush +500 XP!');
      }
    }

    // Streak multiplier
    let streakBonus = 0;
    if (this.streak >= 2) {
      streakBonus = (this.streak - 1) * 150;
      if (window.soundEngine) window.soundEngine.playStreak();
    }

    const earned = ((basePoints + speedBonus) * buffMultiplier) + extraBonus + streakBonus;
    this.score += earned;

    // Coins earned
    const coinsEarned = 35 + (this.streak * 5);
    window.buffManager.addCoins(coinsEarned);

    // Highlight button
    const btn = document.getElementById(`option-${optionId}`);
    if (btn) btn.classList.add('opt-correct');

    // Visual card glow
    const card = document.getElementById('question-card');
    card.classList.add('glow-green');

    // Trigger loot drop roulette check (on streak 2, 4, 6...)
    const shouldDropLoot = (this.streak % 2 === 0);

    this.showFeedback(
      true,
      earned,
      `BENAR! +${earned} Poin 🔥`,
      question.explanation || 'Jawaban Anda tepat sekali!',
      buffNotes,
      shouldDropLoot
    );
  }

  handleWrongAnswer(question, optionId) {
    // Check Aegis Shield
    const hasShield = window.buffManager.isBuffActive('shield');
    if (hasShield) {
      window.buffManager.consumeActiveBuff('shield');
      this.renderInventoryBar();

      if (window.soundEngine) window.soundEngine.playBuff();
      this.showToast('🛡️ AEGIS SHIELD! Perisai menahan kesalahan, streak kamu aman!', 'warning');

      // Still show correct answer & explanation without penalty
      const wrongBtn = document.getElementById(`option-${optionId}`);
      if (wrongBtn) wrongBtn.classList.add('opt-wrong');

      const correctBtn = document.getElementById(`option-${question.correctOptionId}`);
      if (correctBtn) correctBtn.classList.add('opt-correct');

      this.showFeedback(
        false,
        0,
        '🛡️ Terlindungi Perisai!',
        `Jawaban yang benar adalah (${question.correctOptionId}). ${question.explanation || ''}`
      );
      return;
    }

    // No shield: normal wrong
    if (window.soundEngine) window.soundEngine.playWrong();
    this.streak = 0;

    const wrongBtn = document.getElementById(`option-${optionId}`);
    if (wrongBtn) wrongBtn.classList.add('opt-wrong');

    const correctBtn = document.getElementById(`option-${question.correctOptionId}`);
    if (correctBtn) correctBtn.classList.add('opt-correct');

    const card = document.getElementById('question-card');
    card.classList.add('shake-anim');

    this.showFeedback(
      false,
      0,
      'KURANG TEPAT! ❌',
      `Opsi benar adalah (${question.correctOptionId}). ${question.explanation || ''}`
    );
  }

  showFeedback(isCorrect, pointsEarned, title, explanation, buffNotes = [], showLootDrop = false) {
    const box = document.getElementById('answer-feedback-box');
    if (!box) return;

    box.className = `feedback-box ${isCorrect ? 'fb-correct' : 'fb-wrong'}`;
    box.innerHTML = `
      <div class="feedback-header">
        <span class="fb-icon">${isCorrect ? '✨' : '⚠️'}</span>
        <div class="fb-title-wrap">
          <h3 class="fb-title">${title}</h3>
          ${buffNotes.length ? `<span class="fb-buff-tags">${buffNotes.join(' • ')}</span>` : ''}
        </div>
      </div>
      <p class="fb-explanation">${this.escapeHtml(explanation)}</p>
      <div class="fb-action-row">
        ${showLootDrop ? `<button id="btn-claim-loot" class="btn-loot-pulse">🎁 Klaim Buff Drop Roulette!</button>` : ''}
        <button id="btn-next-question" class="btn-primary-action">Lanjut Soal Berikutnya ➔</button>
      </div>
    `;

    box.classList.remove('hidden');
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const nextBtn = document.getElementById('btn-next-question');
    if (nextBtn) {
      nextBtn.onclick = () => {
        this.nextQuestion();
      };
    }

    if (showLootDrop) {
      const lootBtn = document.getElementById('btn-claim-loot');
      if (lootBtn) {
        lootBtn.onclick = () => {
          this.openBuffRouletteModal();
        };
      }
    }
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.currentQuiz.questions.length) {
      this.loadQuestion(this.currentQuestionIndex);
    } else {
      this.finishGame();
    }
  }

  finishGame() {
    clearInterval(this.timerInterval);
    if (window.soundEngine) window.soundEngine.playFanfare();

    const totalTimeElapsed = Math.round((Date.now() - this.startTime) / 1000);
    const totalQ = this.currentQuiz.questions.length;
    const accuracy = Math.round((this.correctCount / totalQ) * 100);

    // Calculate Points/EXP reward for the student!
    const pointsReward = Math.round((this.score / 10) + (this.correctCount * 60));
    if (window.avatarManager) {
      window.avatarManager.addPoints(pointsReward);
    }

    // Get current customized avatar
    const studentAvatarConfig = window.avatarManager 
      ? window.avatarManager.getProfile().avatar 
      : this.selectedAvatar;

    // Save Score Record
    const record = {
      quizId: this.currentQuiz.id,
      quizTitle: this.currentQuiz.title,
      studentName: this.studentName,
      avatar: studentAvatarConfig,
      score: this.score,
      accuracy: accuracy,
      streakMax: this.maxStreak,
      timeElapsed: totalTimeElapsed,
      pointsReward: pointsReward,
      buffsUsed: [...window.buffManager.usedBuffsLog]
    };

    window.storageManager.addScoreRecord(record);

    // Trigger Confetti!
    if (window.triggerConfetti) {
      window.triggerConfetti();
    }

    // Render Victory Screen
    this.renderVictoryScreen(record, pointsReward);
  }

  renderVictoryScreen(record, pointsReward) {
    document.getElementById('game-screen').classList.add('hidden');
    const vicScreen = document.getElementById('victory-screen');
    vicScreen.classList.remove('hidden');

    document.getElementById('vic-student-name').textContent = record.studentName;
    document.getElementById('vic-quiz-title').textContent = record.quizTitle;
    document.getElementById('vic-score-val').textContent = record.score.toLocaleString('id-ID');
    document.getElementById('vic-accuracy-val').textContent = `${record.accuracy}% (${this.correctCount}/${this.currentQuiz.questions.length})`;
    document.getElementById('vic-streak-val').textContent = `${record.streakMax}x 🔥`;
    document.getElementById('vic-time-val').textContent = `${record.timeElapsed} detik`;

    // Render Points Reward Banner
    const rewardEl = document.getElementById('vic-points-reward');
    if (rewardEl) {
      rewardEl.innerHTML = `
        <div class="vic-reward-badge">
          <span class="reward-icon">💎</span>
          <div>
            <strong>+${pointsReward || 0} Poin Toko Didapatkan!</strong>
            <p>Poin telah ditambahkan ke saldomu. Buka <strong>Toko Avatar</strong> untuk membeli baju, topi, dan aksesoris baru!</p>
          </div>
        </div>
      `;
    }

    // Render Custom Avatar in Victory Trophy
    const avatarSpot = document.getElementById('vic-avatar-spot');
    if (avatarSpot && window.avatarManager) {
      avatarSpot.innerHTML = window.avatarManager.renderAvatarHTML(record.avatar, 'lg');
    }

    // Render buffs used badges
    const buffContainer = document.getElementById('vic-buffs-used');
    if (buffContainer) {
      buffContainer.innerHTML = '';
      if (record.buffsUsed && record.buffsUsed.length > 0) {
        record.buffsUsed.forEach(bName => {
          const badge = document.createElement('span');
          badge.className = 'buff-pill';
          badge.textContent = `⚡ ${bName}`;
          buffContainer.appendChild(badge);
        });
      } else {
        buffContainer.innerHTML = '<span class="text-muted">Tidak menggunakan buff</span>';
      }
    }

    // Determine Rank among all scores for this quiz
    const allQuizScores = window.storageManager.getLeaderboard().filter(s => s.quizId === record.quizId);
    allQuizScores.sort((a, b) => b.score - a.score);
    const rank = allQuizScores.findIndex(s => s.id === record.id) + 1;
    
    const rankBadge = document.getElementById('vic-rank-badge');
    if (rankBadge) {
      rankBadge.textContent = rank === 1 ? '🥇 Juara 1 Kelas!' : rank === 2 ? '🥈 Peringkat 2 Kelas!' : rank === 3 ? '🥉 Peringkat 3 Kelas!' : `#${rank} di Papan Nilai`;
    }
  }

  // BUFF ACTIVATION ACTIONS
  activateBuff(buffId) {
    if (this.answeredCurrent) return;

    const success = window.buffManager.useBuff(buffId);
    if (!success) return;

    this.renderInventoryBar();

    const q = this.currentQuiz.questions[this.currentQuestionIndex];

    switch (buffId) {
      case 'freeze':
        this.isFrozen = true;
        const timerBar = document.getElementById('timer-bar-fill');
        if (timerBar) timerBar.classList.add('frozen-bar');
        const cardF = document.getElementById('question-card');
        cardF.classList.add('frozen-card');
        this.showToast('❄️ CHRONOS FREEZE! Waktu dibekukan 15 detik!', 'success');

        this.freezeTimeout = setTimeout(() => {
          this.isFrozen = false;
          if (timerBar) timerBar.classList.remove('frozen-bar');
          if (cardF) cardF.classList.remove('frozen-card');
          this.showToast('❄️ Waktu kembali berjalan normal!', 'info');
        }, 15000);
        break;

      case 'shield':
        const cardS = document.getElementById('question-card');
        cardS.classList.add('shield-active');
        this.showToast('🛡️ AEGIS SHIELD! Perisai aktif melindungi streak!', 'success');
        break;

      case 'fifty_fifty':
        // Eliminate 2 wrong options
        const wrongOpts = q.options.filter(opt => opt.id !== q.correctOptionId);
        // Shuffle wrong opts
        wrongOpts.sort(() => Math.random() - 0.5);
        const toEliminate = wrongOpts.slice(0, 2);

        toEliminate.forEach(elim => {
          const btn = document.getElementById(`option-${elim.id}`);
          if (btn) {
            btn.classList.add('opt-eliminated');
            btn.disabled = true;
          }
        });
        this.showToast('🎯 50:50 SONAR! 2 Opsi salah telah disingkirkan!', 'success');
        break;

      case 'double_surge':
        this.showToast('⚡ DOUBLE SURGE! Poin jawaban ini 2x lipat jika benar!', 'success');
        break;

      case 'oracle':
        const hintBox = document.getElementById('oracle-hint-box');
        const hintText = document.getElementById('oracle-hint-text');
        if (hintBox && hintText) {
          hintText.textContent = q.hint || 'Kunci: Perhatikan kata kunci utama pada pertanyaan dengan seksama!';
          hintBox.classList.remove('hidden');
          hintBox.classList.add('pulse-anim');
        }
        this.showToast('🔮 ORACLE LENS! Petunjuk guru terbuka!', 'info');
        break;

      case 'second_chance':
        this.showToast('🔄 PHOENIX REBIRTH! Peluang kedua aktif jika salah pilih!', 'success');
        break;

      case 'jackpot':
        this.showToast('💎 JACKPOT RUSH! Jawab dalam 5 detik untuk bonus +500 XP!', 'success');
        break;

      case 'clarity':
        const correctBtn = document.getElementById(`option-${q.correctOptionId}`);
        if (correctBtn) {
          correctBtn.classList.add('opt-clarity-glow');
        }
        this.showToast('🧠 MIND CLARITY! Aura petunjuk jawaban memancar halus!', 'info');
        break;
    }
  }

  renderInventoryBar() {
    const container = document.getElementById('buff-inventory-cards');
    if (!container) return;

    container.innerHTML = '';
    const inv = window.buffManager.inventory;

    if (inv.length === 0) {
      container.innerHTML = '<span class="empty-inv-text">Inventory kosong. Kumpulkan combo streak untuk buff drop! 🎁</span>';
      return;
    }

    inv.forEach(buffId => {
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
        this.activateBuff(buffId);
      };
      container.appendChild(card);
    });
  }

  openBuffRouletteModal() {
    const modal = document.getElementById('buff-roulette-modal');
    const cardsWrap = document.getElementById('roulette-cards-container');
    if (!modal || !cardsWrap) return;

    const threeBuffs = window.buffManager.getThreeRandomBuffs();
    cardsWrap.innerHTML = '';

    threeBuffs.forEach((buff, idx) => {
      const card = document.createElement('div');
      card.className = 'roulette-card mystery-card';
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <span class="mystery-symbol">❓</span>
            <p>Pilih Kotak #${idx + 1}</p>
          </div>
          <div class="card-back" style="border-color: ${buff.color}">
            <span class="r-icon">${buff.icon}</span>
            <h4 class="r-name">${buff.name}</h4>
            <span class="r-tag">${buff.tag}</span>
            <p class="r-desc">${buff.desc}</p>
          </div>
        </div>
      `;

      card.onclick = () => {
        if (card.classList.contains('revealed')) return;
        card.classList.add('revealed');
        window.buffManager.addBuffToInventory(buff.id);
        this.renderInventoryBar();
        if (window.soundEngine) window.soundEngine.playBuff();

        setTimeout(() => {
          this.showToast(`🎉 Mendapatkan ${buff.name} (${buff.tag})!`, 'success');
          modal.classList.add('hidden');
        }, 1200);
      };

      cardsWrap.appendChild(card);
    });

    modal.classList.remove('hidden');
  }

  updateHUD() {
    const scoreEl = document.getElementById('hud-score');
    const streakEl = document.getElementById('hud-streak');
    const coinsEl = document.getElementById('hud-coins');

    if (scoreEl) scoreEl.textContent = this.score.toLocaleString('id-ID');
    if (streakEl) streakEl.textContent = `${this.streak}x 🔥`;
    if (coinsEl) coinsEl.textContent = window.buffManager.coins;
  }

  updateLiveClassStanding() {
    const listEl = document.getElementById('live-classmates-list');
    if (!listEl) return;

    const studentAvatarConfig = window.avatarManager ? window.avatarManager.getProfile().avatar : this.selectedAvatar;

    // Combine player and mock classmates
    const standings = [
      { name: `${this.studentName} (Kamu)`, score: this.score, isPlayer: true, avatar: studentAvatarConfig },
      ...this.mockOpponents
    ];

    standings.sort((a, b) => b.score - a.score);

    listEl.innerHTML = '';
    standings.forEach((p, idx) => {
      const li = document.createElement('li');
      li.className = `classmate-item ${p.isPlayer ? 'is-player-item' : ''}`;
      
      const avatarHtml = window.avatarManager 
        ? window.avatarManager.renderAvatarHTML(p.avatar, 'sm')
        : '👤';

      li.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <span class="rank-pos">#${idx + 1}</span>
          ${avatarHtml}
          <span class="c-name">${this.escapeHtml(p.name)}</span>
        </div>
        <span class="c-score">${p.score.toLocaleString('id-ID')}</span>
      `;
      listEl.appendChild(li);
    });
  }

  showToast(message, type = 'info') {
    const toast = document.getElementById('game-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast-popup toast-${type} show`;

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
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

window.gameController = new GameController();
