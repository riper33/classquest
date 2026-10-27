/**
 * Teacher / Admin Studio Controller
 * Mengatur pembuatan kuis, pengisian soal oleh guru, ekspor/impor JSON kuis, dan ekspor nilai CSV
 */

class AdminController {
  constructor() {
    this.editingQuizId = null;
    this.editingQuestionIndex = null;
  }

  init() {
    this.renderQuizList();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const btnNewQuiz = document.getElementById('btn-new-quiz');
    if (btnNewQuiz) {
      btnNewQuiz.onclick = () => this.openQuizModal();
    }

    const btnExportQuizzes = document.getElementById('btn-export-quizzes');
    if (btnExportQuizzes) {
      btnExportQuizzes.onclick = () => this.exportQuizzesJSON();
    }

    const fileImportInput = document.getElementById('file-import-quizzes');
    if (fileImportInput) {
      fileImportInput.onchange = (e) => this.importQuizzesJSON(e);
    }

    const btnResetDefaults = document.getElementById('btn-reset-defaults');
    if (btnResetDefaults) {
      btnResetDefaults.onclick = () => {
        if (confirm('Kembalikan daftar kuis ke template bawaan? (Kuis kustom yang belum diekspor akan diganti)')) {
          window.storageManager.resetDefaultQuizzes();
          this.renderQuizList();
          alert('Berhasil mengembalikan kuis bawaan!');
        }
      };
    }

    // Modal Quiz Form
    const formQuiz = document.getElementById('form-quiz-details');
    if (formQuiz) {
      formQuiz.onsubmit = (e) => this.handleSaveQuizDetails(e);
    }

    // Modal Question Form
    const formQuestion = document.getElementById('form-question-builder');
    if (formQuestion) {
      formQuestion.onsubmit = (e) => this.handleSaveQuestion(e);
    }
  }

  renderQuizList() {
    const container = document.getElementById('admin-quiz-cards');
    if (!container) return;

    const quizzes = window.storageManager.getQuizzes();
    container.innerHTML = '';

    if (quizzes.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <p>Belum ada kuis yang dibuat. Klik tombol "+ Buat Kuis Baru" di atas untuk menambahkan kuis kelas!</p>
        </div>
      `;
      return;
    }

    quizzes.forEach(quiz => {
      const card = document.createElement('div');
      card.className = 'admin-quiz-card glass-panel';

      const questionCount = quiz.questions ? quiz.questions.length : 0;

      card.innerHTML = `
        <div class="quiz-card-head">
          <span class="quiz-badge-icon">${quiz.icon || '📝'}</span>
          <div class="quiz-badge-info">
            <span class="quiz-cat-pill">${this.escapeHtml(quiz.category || 'Umum')}</span>
            <span class="quiz-time-pill">⏱️ ${quiz.timePerQuestion || 20}s/soal</span>
          </div>
        </div>
        <h3 class="admin-quiz-title">${this.escapeHtml(quiz.title)}</h3>
        <p class="admin-quiz-desc">${this.escapeHtml(quiz.description || 'Tidak ada deskripsi.')}</p>
        
        <div class="admin-quiz-meta">
          <span>📊 <strong>${questionCount}</strong> Soal</span>
          <span>🎯 Id: <code>${quiz.id}</code></span>
        </div>

        <div class="admin-quiz-actions">
          <button class="btn-card-action btn-manage-q" data-id="${quiz.id}">
            ✏️ Kelola Soal (${questionCount})
          </button>
          <button class="btn-card-action btn-edit-quiz" data-id="${quiz.id}">
            ⚙️ Edit Info
          </button>
          <button class="btn-card-action btn-delete-quiz" data-id="${quiz.id}">
            🗑️ Hapus
          </button>
        </div>
      `;

      // Event handlers
      card.querySelector('.btn-manage-q').onclick = () => this.openQuestionManager(quiz.id);
      card.querySelector('.btn-edit-quiz').onclick = () => this.openQuizModal(quiz.id);
      card.querySelector('.btn-delete-quiz').onclick = () => this.deleteQuiz(quiz.id);

      container.appendChild(card);
    });

    // Also refresh the home lobby quiz selection dropdown
    if (window.renderLobbyQuizList) {
      window.renderLobbyQuizList();
    }
  }

  openQuizModal(quizId = null) {
    this.editingQuizId = quizId;
    const modal = document.getElementById('modal-quiz-editor');
    const titleModal = document.getElementById('modal-quiz-title-text');
    
    if (quizId) {
      const q = window.storageManager.getQuizById(quizId);
      if (!q) return;
      titleModal.textContent = 'Edit Informasi Kuis';
      document.getElementById('input-quiz-title').value = q.title || '';
      document.getElementById('input-quiz-desc').value = q.description || '';
      document.getElementById('input-quiz-category').value = q.category || 'Umum';
      document.getElementById('input-quiz-icon').value = q.icon || '🚀';
      document.getElementById('input-quiz-timer').value = q.timePerQuestion || 20;
    } else {
      titleModal.textContent = 'Buat Kuis Baru';
      document.getElementById('form-quiz-details').reset();
      document.getElementById('input-quiz-timer').value = 20;
    }

    modal.classList.remove('hidden');
  }

  closeQuizModal() {
    document.getElementById('modal-quiz-editor').classList.add('hidden');
    this.editingQuizId = null;
  }

  handleSaveQuizDetails(e) {
    e.preventDefault();
    const title = document.getElementById('input-quiz-title').value.trim();
    const desc = document.getElementById('input-quiz-desc').value.trim();
    const category = document.getElementById('input-quiz-category').value.trim();
    const icon = document.getElementById('input-quiz-icon').value.trim() || '📝';
    const timer = parseInt(document.getElementById('input-quiz-timer').value, 10) || 20;

    if (!title) {
      alert('Judul kuis tidak boleh kosong!');
      return;
    }

    let quiz;
    if (this.editingQuizId) {
      quiz = window.storageManager.getQuizById(this.editingQuizId);
      if (!quiz) return;
      quiz.title = title;
      quiz.description = desc;
      quiz.category = category;
      quiz.icon = icon;
      quiz.timePerQuestion = timer;
    } else {
      const newId = 'quiz-' + Date.now();
      quiz = {
        id: newId,
        title: title,
        description: desc,
        category: category,
        icon: icon,
        timePerQuestion: timer,
        questions: []
      };
    }

    window.storageManager.saveQuiz(quiz);
    this.closeQuizModal();
    this.renderQuizList();

    // If new quiz, prompt to immediately add questions!
    if (!this.editingQuizId) {
      if (confirm('Kuis berhasil dibuat! Mau langsung menambahkan soal ke dalam kuis ini sekarang?')) {
        this.openQuestionManager(quiz.id);
      }
    }
  }

  deleteQuiz(quizId) {
    const q = window.storageManager.getQuizById(quizId);
    if (!q) return;

    if (confirm(`Yakin ingin menghapus kuis "${q.title}" beserta seluruh soalnya?`)) {
      window.storageManager.deleteQuiz(quizId);
      this.renderQuizList();
    }
  }

  // QUESTION MANAGEMENT FOR A SPECIFIC QUIZ
  openQuestionManager(quizId) {
    this.editingQuizId = quizId;
    const quiz = window.storageManager.getQuizById(quizId);
    if (!quiz) return;

    const modal = document.getElementById('modal-question-manager');
    document.getElementById('qm-quiz-title').textContent = quiz.title;
    
    this.renderQuestionsTable(quiz);
    modal.classList.remove('hidden');
  }

  closeQuestionManager() {
    document.getElementById('modal-question-manager').classList.add('hidden');
    this.renderQuizList();
  }

  renderQuestionsTable(quiz) {
    const container = document.getElementById('qm-questions-list');
    if (!container) return;

    container.innerHTML = '';
    const questions = quiz.questions || [];

    if (questions.length === 0) {
      container.innerHTML = `
        <div class="empty-questions-notice">
          <p>Belum ada soal pada kuis ini. Klik tombol "+ Tambah Soal Baru" di bawah untuk mulai mengisinya!</p>
        </div>
      `;
      return;
    }

    questions.forEach((q, idx) => {
      const item = document.createElement('div');
      item.className = 'qm-question-item glass-card';

      const correctOpt = (q.options || []).find(o => o.id === q.correctOptionId);
      const correctText = correctOpt ? correctOpt.text : 'Belum diatur';

      item.innerHTML = `
        <div class="q-item-header">
          <span class="q-num-pill">No. ${idx + 1}</span>
          <span class="q-points-pill">💎 ${q.points || 1000} XP</span>
        </div>
        <p class="q-item-text"><strong>${this.escapeHtml(q.text)}</strong></p>
        
        <div class="q-options-preview">
          ${(q.options || []).map(opt => `
            <div class="opt-preview-pill ${opt.id === q.correctOptionId ? 'opt-is-correct' : ''}">
              <strong>${opt.id}:</strong> ${this.escapeHtml(opt.text)} ${opt.id === q.correctOptionId ? '✓' : ''}
            </div>
          `).join('')}
        </div>

        <div class="q-hint-preview">
          <span>🔮 <strong>Hint:</strong> ${this.escapeHtml(q.hint || 'Tidak ada')}</span>
          <span>💡 <strong>Penjelasan:</strong> ${this.escapeHtml(q.explanation || 'Tidak ada')}</span>
        </div>

        <div class="q-item-actions">
          <button class="btn-sm btn-edit-q" data-idx="${idx}">✏️ Edit Soal</button>
          <button class="btn-sm btn-delete-q" data-idx="${idx}">🗑️ Hapus Soal</button>
        </div>
      `;

      item.querySelector('.btn-edit-q').onclick = () => this.openQuestionEditor(idx);
      item.querySelector('.btn-delete-q').onclick = () => this.deleteQuestion(idx);

      container.appendChild(item);
    });
  }

  openQuestionEditor(questionIndex = null) {
    this.editingQuestionIndex = questionIndex;
    const quiz = window.storageManager.getQuizById(this.editingQuizId);
    if (!quiz) return;

    const modal = document.getElementById('modal-question-editor');
    const form = document.getElementById('form-question-builder');
    form.reset();

    const titleEl = document.getElementById('qe-modal-title');

    if (questionIndex !== null && quiz.questions && quiz.questions[questionIndex]) {
      const q = quiz.questions[questionIndex];
      titleEl.textContent = `Edit Soal #${questionIndex + 1}`;
      document.getElementById('input-q-text').value = q.text || '';
      
      const optA = (q.options || []).find(o => o.id === 'A');
      const optB = (q.options || []).find(o => o.id === 'B');
      const optC = (q.options || []).find(o => o.id === 'C');
      const optD = (q.options || []).find(o => o.id === 'D');

      document.getElementById('input-opt-a').value = optA ? optA.text : '';
      document.getElementById('input-opt-b').value = optB ? optB.text : '';
      document.getElementById('input-opt-c').value = optC ? optC.text : '';
      document.getElementById('input-opt-d').value = optD ? optD.text : '';

      // Radio correct option
      const radio = form.querySelector(`input[name="correct_opt"][value="${q.correctOptionId}"]`);
      if (radio) radio.checked = true;

      document.getElementById('input-q-hint').value = q.hint || '';
      document.getElementById('input-q-explanation').value = q.explanation || '';
      document.getElementById('input-q-points').value = q.points || 1000;
    } else {
      titleEl.textContent = 'Tambah Soal Baru';
      const radioA = form.querySelector('input[name="correct_opt"][value="A"]');
      if (radioA) radioA.checked = true;
      document.getElementById('input-q-points').value = 1000;
    }

    modal.classList.remove('hidden');
  }

  closeQuestionEditor() {
    document.getElementById('modal-question-editor').classList.add('hidden');
    this.editingQuestionIndex = null;
  }

  handleSaveQuestion(e) {
    e.preventDefault();
    const quiz = window.storageManager.getQuizById(this.editingQuizId);
    if (!quiz) return;

    const text = document.getElementById('input-q-text').value.trim();
    const optA = document.getElementById('input-opt-a').value.trim();
    const optB = document.getElementById('input-opt-b').value.trim();
    const optC = document.getElementById('input-opt-c').value.trim();
    const optD = document.getElementById('input-opt-d').value.trim();
    
    const form = document.getElementById('form-question-builder');
    const checkedRadio = form.querySelector('input[name="correct_opt"]:checked');
    const correctOpt = checkedRadio ? checkedRadio.value : 'A';

    const hint = document.getElementById('input-q-hint').value.trim();
    const explanation = document.getElementById('input-q-explanation').value.trim();
    const points = parseInt(document.getElementById('input-q-points').value, 10) || 1000;

    if (!text || !optA || !optB || !optC || !optD) {
      alert('Harap isi teks pertanyaan dan ke-4 opsi jawaban (A, B, C, D)!');
      return;
    }

    const questionObj = {
      id: 'q-' + Date.now(),
      text: text,
      options: [
        { id: 'A', text: optA },
        { id: 'B', text: optB },
        { id: 'C', text: optC },
        { id: 'D', text: optD }
      ],
      correctOptionId: correctOpt,
      hint: hint,
      explanation: explanation,
      points: points
    };

    if (!quiz.questions) quiz.questions = [];

    if (this.editingQuestionIndex !== null && this.editingQuestionIndex >= 0) {
      quiz.questions[this.editingQuestionIndex] = questionObj;
    } else {
      quiz.questions.push(questionObj);
    }

    window.storageManager.saveQuiz(quiz);
    this.closeQuestionEditor();
    this.renderQuestionsTable(quiz);
  }

  deleteQuestion(idx) {
    const quiz = window.storageManager.getQuizById(this.editingQuizId);
    if (!quiz || !quiz.questions) return;

    if (confirm(`Hapus soal nomor ${idx + 1}?`)) {
      quiz.questions.splice(idx, 1);
      window.storageManager.saveQuiz(quiz);
      this.renderQuestionsTable(quiz);
    }
  }

  // EXPORT / IMPORT QUIZZES
  exportQuizzesJSON() {
    const quizzes = window.storageManager.getQuizzes();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quizzes, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `kuis_classquest_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  }

  importQuizzesJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) {
          alert('Format file JSON tidak valid (harus array kumpulan kuis)!');
          return;
        }
        
        if (confirm(`Ditemukan ${imported.length} kuis di dalam file. Mau menggabungkan dengan kuis yang ada? (OK = Gabung, Cancel = Batal)`)) {
          const current = window.storageManager.getQuizzes();
          // Merge by ID or append
          imported.forEach(newQ => {
            const idx = current.findIndex(c => c.id === newQ.id);
            if (idx >= 0) {
              current[idx] = newQ;
            } else {
              current.push(newQ);
            }
          });
          window.storageManager.saveQuizzes(current);
          this.renderQuizList();
          alert('Berhasil mengimpor kuis!');
        }
      } catch (err) {
        alert('Gagal membaca file JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
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

window.adminController = new AdminController();
