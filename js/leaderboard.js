/**
 * Leaderboard & Class Score Recap Controller
 * Menampilkan siapa nilai tertinggi di kelas, peringkat kuis, dan ekspor rekap nilai ke CSV
 */

class LeaderboardController {
  constructor() {
    this.selectedQuizFilter = 'ALL';
  }

  init() {
    this.setupFilters();
    this.renderLeaderboard();
  }

  setupFilters() {
    const filterSelect = document.getElementById('lb-quiz-filter');
    if (!filterSelect) return;

    filterSelect.onchange = (e) => {
      this.selectedQuizFilter = e.target.value;
      this.renderLeaderboard();
    };

    const btnExportCSV = document.getElementById('btn-export-grades-csv');
    if (btnExportCSV) {
      btnExportCSV.onclick = () => this.exportGradesToCSV();
    }

    const btnClearLB = document.getElementById('btn-clear-leaderboard');
    if (btnClearLB) {
      btnClearLB.onclick = () => {
        if (confirm('Yakin ingin mereset data nilai papan peringkat kelas?')) {
          window.storageManager.clearLeaderboard();
          this.renderLeaderboard();
        }
      };
    }
  }

  refreshQuizFilterOptions() {
    const filterSelect = document.getElementById('lb-quiz-filter');
    if (!filterSelect) return;

    const quizzes = window.storageManager.getQuizzes();
    const currentVal = filterSelect.value || 'ALL';

    filterSelect.innerHTML = '<option value="ALL">🌟 Semua Kuis (Peringkat Keseluruhan)</option>';
    quizzes.forEach(q => {
      const opt = document.createElement('option');
      opt.value = q.id;
      opt.textContent = `${q.icon || '📝'} ${q.title}`;
      filterSelect.appendChild(opt);
    });

    filterSelect.value = currentVal;
  }

  renderLeaderboard() {
    this.refreshQuizFilterOptions();

    let scores = window.storageManager.getLeaderboard();

    // Filter by selected quiz if not ALL
    if (this.selectedQuizFilter !== 'ALL') {
      scores = scores.filter(s => s.quizId === this.selectedQuizFilter);
    }

    // Sort by highest score first, then by fastest time
    scores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return (a.timeElapsed || 999) - (b.timeElapsed || 999);
    });

    // Render Podium Top 3
    this.renderPodium(scores.slice(0, 3));

    // Render Table
    this.renderTable(scores);
  }

  renderPodium(top3) {
    const podiumEl = document.getElementById('lb-podium-cards');
    if (!podiumEl) return;

    podiumEl.innerHTML = '';

    if (top3.length === 0) {
      podiumEl.innerHTML = '<div class="no-records-notice">Belum ada skor yang tercatat. Mainkan kuis untuk mencetak rekor pertama!</div>';
      return;
    }

    const podiumOrder = [
      { rank: 2, medal: '🥈', title: 'Juara 2', class: 'podium-rank-2' },
      { rank: 1, medal: '🥇', title: 'Juara 1 Tertinggi', class: 'podium-rank-1' },
      { rank: 3, medal: '🥉', title: 'Juara 3', class: 'podium-rank-3' }
    ];

    podiumOrder.forEach(slot => {
      const item = top3[slot.rank - 1];
      const card = document.createElement('div');
      card.className = `podium-slot ${slot.class} ${!item ? 'slot-empty' : ''}`;

      if (item) {
        card.innerHTML = `
          <div class="podium-crown">${slot.medal}</div>
          <div class="podium-avatar">${this.getAvatarIcon(item.avatar, 'md')}</div>
          <h4 class="podium-name">${this.escapeHtml(item.studentName)}</h4>
          <span class="podium-score">${item.score.toLocaleString('id-ID')} Pts</span>
          <span class="podium-quiz">${this.escapeHtml(item.quizTitle)}</span>
          <span class="podium-acc">Akurasi: ${item.accuracy}% • 🔥 ${item.streakMax || 0}x</span>
        `;
      } else {
        card.innerHTML = `
          <div class="podium-crown">${slot.medal}</div>
          <div class="podium-avatar">👤</div>
          <h4 class="podium-name">-</h4>
          <span class="podium-score">0 Pts</span>
          <span class="podium-quiz">Menunggu Peserta</span>
        `;
      }

      podiumEl.appendChild(card);
    });
  }

  renderTable(scores) {
    const tbody = document.getElementById('lb-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (scores.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-4">Belum ada nilai pada kuis ini.</td>
        </tr>
      `;
      return;
    }

    scores.forEach((s, idx) => {
      const tr = document.createElement('tr');
      if (idx === 0) tr.className = 'row-first-place';
      else if (idx === 1) tr.className = 'row-second-place';
      else if (idx === 2) tr.className = 'row-third-place';

      const dateStr = s.timestamp ? new Date(s.timestamp).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }) : '-';

      const rankBadge = idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `#${idx + 1}`;

      const buffsHtml = (s.buffsUsed && s.buffsUsed.length > 0)
        ? s.buffsUsed.map(b => `<span class="tbl-buff-pill">⚡ ${this.escapeHtml(b)}</span>`).join(' ')
        : '<span class="text-muted">-</span>';

      tr.innerHTML = `
        <td class="col-rank"><strong>${rankBadge}</strong></td>
        <td class="col-student">
          <div class="student-cell">
            <span class="st-avatar">${this.getAvatarIcon(s.avatar)}</span>
            <strong>${this.escapeHtml(s.studentName)}</strong>
          </div>
        </td>
        <td class="col-quiz">${this.escapeHtml(s.quizTitle || '-')}</td>
        <td class="col-score"><strong>${s.score.toLocaleString('id-ID')}</strong></td>
        <td class="col-acc">
          <span class="acc-badge ${s.accuracy >= 80 ? 'acc-high' : s.accuracy >= 60 ? 'acc-mid' : 'acc-low'}">
            ${s.accuracy}%
          </span>
        </td>
        <td class="col-streak">${s.streakMax || 0}x 🔥</td>
        <td class="col-buffs">${buffsHtml}</td>
        <td class="col-date">${dateStr}</td>
      `;

      tbody.appendChild(tr);
    });
  }

  getAvatarIcon(avatarData, size = 'sm') {
    if (window.avatarManager && typeof avatarData === 'object' && avatarData !== null) {
      return window.avatarManager.renderAvatarHTML(avatarData, size);
    }
    const list = window.AVATAR_CHARACTERS || [];
    const found = list.find(a => a.id === avatarData);
    return found ? found.icon : '🎓';
  }

  exportGradesToCSV() {
    let scores = window.storageManager.getLeaderboard();
    if (this.selectedQuizFilter !== 'ALL') {
      scores = scores.filter(s => s.quizId === this.selectedQuizFilter);
    }

    if (scores.length === 0) {
      alert('Belum ada nilai yang bisa diekspor!');
      return;
    }

    // CSV Headers
    const headers = ['Peringkat', 'Nama Siswa', 'Kuis', 'Nilai Skor', 'Akurasi (%)', 'Max Streak', 'Waktu (detik)', 'Buff Digunakan', 'Tanggal'];
    
    const rows = scores.map((s, idx) => {
      const dateStr = s.timestamp ? new Date(s.timestamp).toLocaleString('id-ID') : '-';
      const buffs = (s.buffsUsed || []).join('; ');
      return [
        idx + 1,
        `"${(s.studentName || '').replace(/"/g, '""')}"`,
        `"${(s.quizTitle || '').replace(/"/g, '""')}"`,
        s.score || 0,
        s.accuracy || 0,
        s.streakMax || 0,
        s.timeElapsed || 0,
        `"${buffs.replace(/"/g, '""')}"`,
        `"${dateStr}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_nilai_kelas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
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

window.leaderboardController = new LeaderboardController();
