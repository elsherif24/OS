// ===== GLOBAL QUESTION BANK =====
// Each js/testbank/lec__.js and js/student/lec__.js pushes into this array
if (typeof window.ALL_QUESTIONS === 'undefined') {
  window.ALL_QUESTIONS = [];
}

// ===== APP MODULE =====
const App = (() => {
  // --- State ---
  let filteredQuestions = [];
  let currentIndex = 0;
  let answeredState = {}; // { questionId: { answered: true, selectedIndex: number|null, judged?: bool } }
  let isOnCompletionScreen = false;

  // --- Lecture Config ---
  const TOTAL_CHAPTERS = 4;

  // --- DOM Cache ---
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const DOM = {};

  function cacheDom() {
    // Screens
    DOM.homeScreen = $('#home-screen');
    DOM.quizScreen = $('#quiz-screen');

    // Home
    DOM.chapterCheckboxes = $('#chapter-checkboxes');
    DOM.startBtn = $('#start-btn');
    DOM.countPreview = $('#question-count-preview');
    DOM.filterSolved = $('#filter-solved');
    DOM.filterWrong = $('#filter-wrong');
    DOM.filterRandom = $('#filter-random');

    // Quiz
    DOM.backBtn = $('#back-btn');
    DOM.progressText = $('#progress-text');
    DOM.progressFill = $('#progress-fill');
    DOM.questionCard = $('#question-card');
    DOM.qChapter = $('#q-chapter');
    DOM.qType = $('#q-type');
    DOM.qSource = $('#q-source');
    DOM.qSolvedBadge = $('#q-solved-badge');
    DOM.qWrongBadge = $('#q-wrong-badge');
    DOM.qFigure = $('#q-figure');
    DOM.qFigureImg = $('#q-figure-img');
    DOM.qText = $('#q-text');
    DOM.qChoices = $('#q-choices');
    DOM.qHintBlock = $('#q-hint-block');
    DOM.qHintText = $('#q-hint-text');
    DOM.qAnswerBlock = $('#q-answer-block');
    DOM.qAnswerContent = $('#q-answer-content');
    DOM.revealBtn = $('#reveal-btn');
    DOM.gotRightBtn = $('#got-right-btn');
    DOM.gotWrongBtn = $('#got-wrong-btn');
    DOM.prevBtn = $('#prev-btn');
    DOM.nextBtn = $('#next-btn');

    // Settings
    DOM.settingsBtn = $('#settings-btn');
    DOM.quizSettingsBtn = $('#quiz-settings-btn');
    DOM.settingsModal = $('#settings-modal');
    DOM.closeSettings = $('#close-settings');
    DOM.themeToggle = $('#theme-toggle');
    DOM.themeLabel = $('#theme-label');
    DOM.exportBtn = $('#export-btn');
    DOM.importBtn = $('#import-btn');
    DOM.importFile = $('#import-file');
    DOM.resetChapterSelect = $('#reset-chapter-select');
    DOM.resetChapterBtn = $('#reset-chapter-btn');
    DOM.resetAllBtn = $('#reset-all-btn');

    // Toast
    DOM.toast = $('#toast');
  }

  // ===== INITIALIZATION =====
  function init() {
    cacheDom();
    applyTheme(Storage.getTheme());
    buildChapterCheckboxes();
    buildResetChapterSelect();
    restorePreferences();
    bindEvents();
    updateQuestionCount();
  }

  // ===== THEME =====
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (DOM.themeLabel) {
      DOM.themeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }
  }

  // ===== BUILD UI =====
  function buildChapterCheckboxes() {
    let html = '';
    for (let i = 1; i <= TOTAL_CHAPTERS; i++) {
      const num = String(i).padStart(2, '0');
      html += `
        <label class="chip">
          <input type="checkbox" name="chapter" value="${i}" checked>
          <span>Lecture ${num}</span>
        </label>`;
    }
    DOM.chapterCheckboxes.innerHTML = html;
  }

  function buildResetChapterSelect() {
    let html = '';
    for (let i = 1; i <= TOTAL_CHAPTERS; i++) {
      const num = String(i).padStart(2, '0');
      html += `<option value="${i}">Lecture ${num}</option>`;
    }
    DOM.resetChapterSelect.innerHTML = html;
  }

  // ===== PREFERENCES =====
  function gatherPreferences() {
    const chapters = [];
    $$('input[name="chapter"]:checked').forEach((cb) => chapters.push(parseInt(cb.value)));

    const sources = [];
    $$('input[name="source"]:checked').forEach((cb) => sources.push(cb.value));

    const types = [];
    $$('input[name="type"]:checked').forEach((cb) => types.push(cb.value));

    const includeSolved = DOM.filterSolved.checked;
    const onlyWrong = DOM.filterWrong.checked;
    const randomize = DOM.filterRandom.checked;

    return { chapters, sources, types, includeSolved, onlyWrong, randomize };
  }

  function restorePreferences() {
    const prefs = Storage.getPreferences();
    if (!prefs) return;

    // Chapters
    if (prefs.chapters) {
      $$('input[name="chapter"]').forEach((cb) => {
        cb.checked = prefs.chapters.includes(parseInt(cb.value));
      });
    }

    // Sources
    if (prefs.sources) {
      $$('input[name="source"]').forEach((cb) => {
        cb.checked = prefs.sources.includes(cb.value);
      });
    }

    // Types
    if (prefs.types) {
      $$('input[name="type"]').forEach((cb) => {
        cb.checked = prefs.types.includes(cb.value);
      });
    }

    // Filters
    if (typeof prefs.includeSolved === 'boolean') {
      DOM.filterSolved.checked = prefs.includeSolved;
    }
    if (typeof prefs.onlyWrong === 'boolean') {
      DOM.filterWrong.checked = prefs.onlyWrong;
    }
    if (typeof prefs.randomize === 'boolean') {
      DOM.filterRandom.checked = prefs.randomize;
    }
  }

  function savePreferences() {
    Storage.setPreferences(gatherPreferences());
  }

  // ===== FILTERING =====
  function getFilteredQuestions() {
    const prefs = gatherPreferences();
    let questions = window.ALL_QUESTIONS.filter((q) => {
      if (!prefs.chapters.includes(q.chapter)) return false;
      if (!prefs.sources.includes(q.source)) return false;

      // For figure-type questions, check the subtype; for non-figure, check type directly
      const qType = q.type === 'figure' ? q.subtype : q.type;

      // If the question is a figure, it should be included if user selected
      // the underlying subtype OR if we just treat 'figure' as its own type
      // We check: does the type list include this question's type?
      // 'figure' questions have a subtype; we match on the subtype
      if (q.type === 'figure') {
        // include if the subtype matches any selected type
        if (!prefs.types.includes(q.subtype)) return false;
      } else {
        if (!prefs.types.includes(q.type)) return false;
      }

      // "Only Wrong" mode: show only questions marked wrong
      if (prefs.onlyWrong) {
        if (!Storage.isWrong(q.id)) return false;
      } else {
        // Normal mode: exclude solved unless "Include Solved" is checked
        if (!prefs.includeSolved && Storage.isSolved(q.id)) return false;
      }

      return true;
    });

    if (prefs.randomize) {
      questions = shuffleArray([...questions]);
    }

    return questions;
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function updateQuestionCount() {
    const count = getFilteredQuestions().length;
    DOM.countPreview.textContent = `${count} question${count !== 1 ? 's' : ''} match your selection`;
    DOM.startBtn.disabled = count === 0;
  }

  // ===== SCREENS =====
  function showScreen(screen) {
    $$('.screen').forEach((s) => s.classList.remove('active'));
    screen.classList.add('active');
    window.scrollTo(0, 0);
  }

  // ===== QUIZ ENGINE =====
  function startQuiz() {
    savePreferences();
    filteredQuestions = getFilteredQuestions();

    if (filteredQuestions.length === 0) {
      showToast('No questions match your selection', 'error');
      return;
    }

    currentIndex = 0;
    answeredState = {};
    showScreen(DOM.quizScreen);
    renderQuestion();
  }

  function renderQuestion() {
    if (filteredQuestions.length === 0) return;

    const q = filteredQuestions[currentIndex];
    const total = filteredQuestions.length;
    const isSolved = Storage.isSolved(q.id);
    const isWrong = Storage.isWrong(q.id);
    const state = answeredState[q.id];

    // Progress
    DOM.progressText.textContent = `${currentIndex + 1} / ${total}`;
    DOM.progressFill.style.width = `${((currentIndex + 1) / total) * 100}%`;

    // Re-trigger card animation
    DOM.questionCard.style.animation = 'none';
    DOM.questionCard.offsetHeight; // force reflow
    DOM.questionCard.style.animation = '';

    // Meta badges
    const chNum = String(q.chapter).padStart(2, '0');
    DOM.qChapter.textContent = `Lec ${chNum}`;
    DOM.qType.textContent = formatType(q.type === 'figure' ? q.subtype : q.type);
    DOM.qSource.textContent = q.source === 'student' ? "Student's" : 'Testbank';

    if (isSolved) {
      DOM.qSolvedBadge.classList.remove('hidden');
    } else {
      DOM.qSolvedBadge.classList.add('hidden');
    }

    if (isWrong) {
      DOM.qWrongBadge.classList.remove('hidden');
    } else {
      DOM.qWrongBadge.classList.add('hidden');
    }

    // Figure
    if (q.figure) {
      DOM.qFigure.classList.remove('hidden');
      DOM.qFigureImg.src = q.figure;
      DOM.qFigureImg.alt = 'Question figure';
    } else {
      DOM.qFigure.classList.add('hidden');
      DOM.qFigureImg.src = '';
    }

    // Question text
    DOM.qText.textContent = q.question;

    // Reset areas
    DOM.qChoices.innerHTML = '';
    DOM.qHintBlock.classList.add('hidden');
    DOM.qHintText.textContent = '';
    DOM.qAnswerBlock.classList.add('hidden');
    DOM.qAnswerContent.innerHTML = '';
    DOM.revealBtn.classList.add('hidden');
    DOM.gotRightBtn.classList.add('hidden');
    DOM.gotWrongBtn.classList.add('hidden');

    // Determine effective type
    const effectiveType = q.type === 'figure' ? (q.subtype || 'list') : q.type;

    // Render based on type
    if (effectiveType === 'mcq' || effectiveType === 'tf') {
      renderChoices(q, state);
      // Show hint only if already answered
      if (state && state.answered) {
        if (q.hint) {
          DOM.qHintText.textContent = q.hint;
          DOM.qHintBlock.classList.remove('hidden');
        }
      }
    } else {
      // list, define, fill — show reveal button
      if (state && state.answered) {
        // Already revealed
        showAnswerBlock(q);
        // Show self-assessment buttons if not yet judged
        if (!state.judged) {
          DOM.gotRightBtn.classList.remove('hidden');
          DOM.gotWrongBtn.classList.remove('hidden');
        }
      } else {
        DOM.revealBtn.classList.remove('hidden');
      }
    }

    // Navigation
    DOM.prevBtn.disabled = currentIndex === 0;

    // Last question: show "Done" instead of disabling
    if (currentIndex === total - 1) {
      DOM.nextBtn.innerHTML = `
        Done
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      `;
      DOM.nextBtn.disabled = false;
    } else {
      DOM.nextBtn.innerHTML = `
        Next
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      `;
      DOM.nextBtn.disabled = false;
    }
  }

  function renderChoices(q, state) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const choices = q.choices || [];

    choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `
        <span class="choice-letter">${letters[idx]}</span>
        <span class="choice-text">${escapeHtml(choice)}</span>
      `;

      if (state && state.answered) {
        // Already answered — show result
        btn.classList.add('disabled');
        if (idx === q.answer) {
          btn.classList.add('correct');
        } else if (idx === state.selectedIndex) {
          btn.classList.add('wrong');
        } else {
          btn.classList.add('dimmed');
        }
      } else {
        // Not yet answered — bind click
        btn.addEventListener('click', () => handleChoiceClick(q, idx));
      }

      DOM.qChoices.appendChild(btn);
    });
  }

  function handleChoiceClick(q, selectedIndex) {
    const isCorrect = selectedIndex === q.answer;

    // Save state
    answeredState[q.id] = { answered: true, selectedIndex };

    // Mark solved only if correct, mark wrong if incorrect
    if (isCorrect) {
      Storage.markSolved(q.id);
    } else {
      Storage.markWrong(q.id);
    }

    // Re-render to show correct/wrong
    renderQuestion();
  }

  function showAnswerBlock(q) {
    DOM.qAnswerBlock.classList.remove('hidden');

    const answer = q.answer;

    if (Array.isArray(answer)) {
      // List answer
      let html = '<ul>';
      answer.forEach((item) => {
        html += `<li>${escapeHtml(item)}</li>`;
      });
      html += '</ul>';
      DOM.qAnswerContent.innerHTML = html;
    } else {
      // String answer
      DOM.qAnswerContent.textContent = answer;
    }
  }

  function handleReveal() {
    const qObj = filteredQuestions[currentIndex];
    if (!qObj) return;
    answeredState[qObj.id] = { answered: true, selectedIndex: null, judged: false };
    renderQuestion();
  }

  function handleGotRight() {
    const q = filteredQuestions[currentIndex];
    if (!q) return;
    Storage.markSolved(q.id);
    answeredState[q.id].judged = true;
    showToast('Marked as solved', 'success');
    renderQuestion();
  }

  function handleGotWrong() {
    const q = filteredQuestions[currentIndex];
    if (!q) return;
    Storage.markWrong(q.id);
    answeredState[q.id].judged = true;
    showToast('Marked as wrong', 'error');
    renderQuestion();
  }

  // ===== HELPERS =====
  function formatType(type) {
    const map = {
      mcq: 'MCQ',
      tf: 'True/False',
      list: 'List',
      define: 'Define',
      fill: 'Fill',
      figure: 'Figure',
    };
    return map[type] || type;
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ===== TOAST =====
  let toastTimeout = null;

  function showToast(message, type = 'info') {
    DOM.toast.textContent = message;
    DOM.toast.className = `toast toast-${type}`;

    // Force reflow for animation restart
    DOM.toast.offsetHeight;
    DOM.toast.classList.add('visible');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      DOM.toast.classList.remove('visible');
      setTimeout(() => {
        DOM.toast.classList.add('hidden');
      }, 300);
    }, 2500);
  }

  // ===== SETTINGS =====
  function openSettings() {
    DOM.settingsModal.classList.remove('hidden');
  }

  function closeSettingsModal() {
    DOM.settingsModal.classList.add('hidden');
  }

  function handleExport() {
    const json = Storage.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'os_review_data.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported', 'success');
  }

  function handleImport() {
    DOM.importFile.click();
  }

  function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = Storage.importData(ev.target.result);
      if (result.success) {
        showToast(result.message, 'success');
        applyTheme(Storage.getTheme());
        restorePreferences();
        updateQuestionCount();
      } else {
        showToast(result.message, 'error');
      }
    };
    reader.readAsText(file);

    // Reset input so same file can be re-imported
    DOM.importFile.value = '';
  }

  function handleResetChapter() {
    const chapter = parseInt(DOM.resetChapterSelect.value);
    const chNum = String(chapter).padStart(2, '0');

    if (confirm(`Reset all progress for Lecture ${chNum}?`)) {
      Storage.resetChapter(chapter);
      showToast(`Lecture ${chNum} progress reset`, 'success');
      updateQuestionCount();
    }
  }

  function handleResetAll() {
    if (confirm('Reset ALL progress? This cannot be undone.')) {
      Storage.resetAll();
      showToast('All progress reset', 'success');
      updateQuestionCount();
    }
  }

  // ===== COMPLETION =====
  function showCompletion() {
    isOnCompletionScreen = true;
    const total = filteredQuestions.length;

    // Calculate score from session
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    filteredQuestions.forEach((q) => {
      const state = answeredState[q.id];
      if (!state || !state.answered) {
        skipped++;
      } else {
        const effectiveType = q.type === 'figure' ? (q.subtype || 'list') : q.type;
        if (effectiveType === 'mcq' || effectiveType === 'tf') {
          // Auto-checked: correct if selected === answer
          if (state.selectedIndex === q.answer) {
            correct++;
          } else {
            wrong++;
          }
        } else {
          // Self-assessed: judged via got-right / got-wrong
          if (state.judged) {
            if (Storage.isSolved(q.id)) {
              correct++;
            } else {
              wrong++;
            }
          } else {
            skipped++;
          }
        }
      }
    });

    const answered = correct + wrong;
    const percentage = answered > 0 ? Math.round((correct / answered) * 100) : 0;

    // Pick emoji based on score
    let emoji = '🎉';
    let message = 'Perfect score!';
    if (percentage < 50) {
      emoji = '💪';
      message = 'Keep practicing, you\'ll get there!';
    } else if (percentage < 75) {
      emoji = '📚';
      message = 'Good effort, review the wrong ones!';
    } else if (percentage < 100) {
      emoji = '🌟';
      message = 'Great job, almost perfect!';
    }

    DOM.questionCard.innerHTML = `
      <div class="completion-card">
        <div class="completion-icon">${emoji}</div>
        <h2>Session Complete!</h2>
        <p>${message}</p>
        <div class="score-summary">
          <div class="score-row">
            <span class="score-label">Total Questions</span>
            <span class="score-value">${total}</span>
          </div>
          <div class="score-row score-correct">
            <span class="score-label">✓ Correct</span>
            <span class="score-value">${correct}</span>
          </div>
          <div class="score-row score-wrong">
            <span class="score-label">✗ Wrong</span>
            <span class="score-value">${wrong}</span>
          </div>
          ${skipped > 0 ? `
          <div class="score-row score-skipped">
            <span class="score-label">— Skipped</span>
            <span class="score-value">${skipped}</span>
          </div>` : ''}
          <div class="score-row score-percentage">
            <span class="score-label">Score</span>
            <span class="score-value">${answered > 0 ? percentage + '%' : '—'}</span>
          </div>
        </div>
        <button class="btn-primary" onclick="document.querySelector('#back-btn').click()">Back to Home</button>
      </div>
    `;

    DOM.revealBtn.classList.add('hidden');
    DOM.gotRightBtn.classList.add('hidden');
    DOM.gotWrongBtn.classList.add('hidden');
    DOM.qChoices.innerHTML = '';
    DOM.qHintBlock.classList.add('hidden');
    DOM.qAnswerBlock.classList.add('hidden');

    // Hide progress bar area and nav
    DOM.prevBtn.disabled = true;
    DOM.nextBtn.disabled = true;
    DOM.nextBtn.classList.add('hidden');
    DOM.prevBtn.classList.add('hidden');
  }

  // ===== EVENT BINDING =====
  function bindEvents() {
    // --- Home preference changes -> update count ---
    DOM.chapterCheckboxes.addEventListener('change', () => {
      updateQuestionCount();
    });

    $$('input[name="source"], input[name="type"]').forEach((cb) => {
      cb.addEventListener('change', updateQuestionCount);
    });

    DOM.filterSolved.addEventListener('change', () => {
      // "Include Solved" and "Only Wrong" are mutually exclusive logic-wise
      if (DOM.filterSolved.checked) {
        DOM.filterWrong.checked = false;
      }
      updateQuestionCount();
    });
    DOM.filterWrong.addEventListener('change', () => {
      if (DOM.filterWrong.checked) {
        DOM.filterSolved.checked = false;
      }
      updateQuestionCount();
    });
    DOM.filterRandom.addEventListener('change', updateQuestionCount);

    // --- Select All / Deselect All ---
    $$('[data-select-all]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-select-all');
        $$(`input[name="${name}"]`).forEach((cb) => (cb.checked = true));
        updateQuestionCount();
      });
    });

    $$('[data-deselect-all]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-deselect-all');
        $$(`input[name="${name}"]`).forEach((cb) => (cb.checked = false));
        updateQuestionCount();
      });
    });

    // --- Start ---
    DOM.startBtn.addEventListener('click', startQuiz);

    // --- Back ---
    DOM.backBtn.addEventListener('click', () => {
      isOnCompletionScreen = false;
      DOM.prevBtn.classList.remove('hidden');
      DOM.nextBtn.classList.remove('hidden');
      updateQuestionCount();
      showScreen(DOM.homeScreen);
    });

    // --- Navigation ---
    DOM.prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
      }
    });

    DOM.nextBtn.addEventListener('click', () => {
      if (isOnCompletionScreen) return;
      if (currentIndex < filteredQuestions.length - 1) {
        currentIndex++;
        renderQuestion();
      } else {
        // Last question — "Done" was clicked
        showCompletion();
      }
    });

    // --- Keyboard Navigation ---
    document.addEventListener('keydown', (e) => {
      if (!DOM.quizScreen.classList.contains('active')) return;
      if (DOM.settingsModal && !DOM.settingsModal.classList.contains('hidden')) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (currentIndex > 0) {
          currentIndex--;
          renderQuestion();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (currentIndex < filteredQuestions.length - 1) {
          currentIndex++;
          renderQuestion();

        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        // Space/Enter to reveal answer for non-choice types
        if (!DOM.revealBtn.classList.contains('hidden')) {
          e.preventDefault();
          handleReveal();
        }
      }
    });

    // --- Reveal ---
    DOM.revealBtn.addEventListener('click', () => handleReveal());

    // --- Got Right / Got Wrong (self-assessment for list/define/fill) ---
    DOM.gotRightBtn.addEventListener('click', handleGotRight);
    DOM.gotWrongBtn.addEventListener('click', handleGotWrong);

    // --- Settings ---
    DOM.settingsBtn.addEventListener('click', openSettings);
    DOM.quizSettingsBtn.addEventListener('click', openSettings);
    DOM.closeSettings.addEventListener('click', closeSettingsModal);

    // Close modal on overlay click
    DOM.settingsModal.querySelector('.modal-overlay').addEventListener('click', closeSettingsModal);

    // Close modal on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !DOM.settingsModal.classList.contains('hidden')) {
        closeSettingsModal();
      }
    });

    // Theme toggle
    DOM.themeToggle.addEventListener('click', () => {
      const newTheme = Storage.toggleTheme();
      applyTheme(newTheme);
    });

    // Export / Import
    DOM.exportBtn.addEventListener('click', handleExport);
    DOM.importBtn.addEventListener('click', handleImport);
    DOM.importFile.addEventListener('change', handleImportFile);

    // Reset
    DOM.resetChapterBtn.addEventListener('click', handleResetChapter);
    DOM.resetAllBtn.addEventListener('click', handleResetAll);
  }

  // --- Public ---
  return { init };
})();

// ===== START =====
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
