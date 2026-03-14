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
  const TOTAL_LECTURES = 4;

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

  // ===== QUESTION ENRICHMENT =====
  function normalizeText(text) {
    return String(text || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
  }

  function fnv1aHex(input) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  function buildQuestionId({ lecture, source, type, question }) {
    const nn = String(lecture).padStart(2, '0');
    const payload = normalizeText(question);
    const hash = fnv1aHex(payload);
    return `lec_${nn}_${source}_${type}_${hash}`;
  }

  function inferLectureFromQuestionText(questionText) {
    // Fallback-only heuristic when lecture isn't present:
    // finds patterns like "lecture 01", "lec01", "lec 1"
    const t = String(questionText || '').toLowerCase();
    const m = t.match(/\b(?:lecture|lec)\s*0?([1-9]\d?)\b/);
    if (m) return parseInt(m[1], 10);
    return 1;
  }

  function inferSourceFromQuestionShape(q) {
    // Conservative fallback: if we don't know, assume testbank
    // (source should ideally be set in data-loader context)
    if (q && (q.source === 'student' || q.source === 'testbank')) {
      return q.source;
    }
    return 'testbank';
  }

  function enrichQuestions() {
    window.ALL_QUESTIONS = window.ALL_QUESTIONS.map((q) => {
      const lecture = Number.isInteger(q.lecture)
        ? q.lecture
        : Number.isInteger(q.chapter)
          ? q.chapter
          : inferLectureFromQuestionText(q.question);

      const source = inferSourceFromQuestionShape(q);
      const type = String(q.type || '').toLowerCase();

      const id = buildQuestionId({
        lecture,
        source,
        type,
        question: q.question,
      });

      return {
        ...q,
        lecture,
        source,
        id,
      };
    });
  }

  // ===== INITIALIZATION =====
  function init() {
    cacheDom();
    enrichQuestions();
    applyTheme(Storage.getTheme());
    buildLectureCheckboxes();
    buildResetLectureSelect();
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
  function buildLectureCheckboxes() {
    let html = '';
    for (let i = 1; i <= TOTAL_LECTURES; i++) {
      const num = String(i).padStart(2, '0');
      html += `
        <label class="chip">
          <input type="checkbox" name="chapter" value="${i}" checked>
          <span>Lecture ${num}</span>
        </label>`;
    }
    DOM.chapterCheckboxes.innerHTML = html;
  }

  function buildResetLectureSelect() {
    let html = '';
    for (let i = 1; i <= TOTAL_LECTURES; i++) {
      const num = String(i).padStart(2, '0');
      html += `<option value="${i}">Lecture ${num}</option>`;
    }
    DOM.resetChapterSelect.innerHTML = html;
  }

  // ===== PREFERENCES =====
  function gatherPreferences() {
    const lectures = [];
    $$('input[name="chapter"]:checked').forEach((cb) => lectures.push(parseInt(cb.value, 10)));

    const sources = [];
    $$('input[name="source"]:checked').forEach((cb) => sources.push(cb.value));

    const types = [];
    $$('input[name="type"]:checked').forEach((cb) => types.push(cb.value));

    const includeSolved = DOM.filterSolved.checked;
    const onlyWrong = DOM.filterWrong.checked;
    const randomize = DOM.filterRandom.checked;

    return { lectures, sources, types, includeSolved, onlyWrong, randomize };
  }

  function restorePreferences() {
    const prefs = Storage.getPreferences();
    if (!prefs) return;

    if (prefs.lectures) {
      $$('input[name="chapter"]').forEach((cb) => {
        cb.checked = prefs.lectures.includes(parseInt(cb.value, 10));
      });
    }

    if (prefs.sources) {
      $$('input[name="source"]').forEach((cb) => {
        cb.checked = prefs.sources.includes(cb.value);
      });
    }

    if (prefs.types) {
      $$('input[name="type"]').forEach((cb) => {
        cb.checked = prefs.types.includes(cb.value);
      });
    }

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
      if (!prefs.lectures.includes(q.lecture)) return false;
      if (!prefs.sources.includes(q.source)) return false;

      const qType = q.type === 'figure' ? q.subtype : q.type;

      if (q.type === 'figure') {
        if (!prefs.types.includes(q.subtype)) return false;
      } else {
        if (!prefs.types.includes(qType)) return false;
      }

      if (prefs.onlyWrong) {
        if (!Storage.isWrong(q.id)) return false;
      } else {
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
    isOnCompletionScreen = false;
    showScreen(DOM.quizScreen);
    renderQuestion();
  }

  function renderQuestion() {
    if (filteredQuestions.length === 0) return;

    const q = filteredQuestions[currentIndex];
    const total = filteredQuestions.length;

    // Top progress
    DOM.progressText.textContent = `${currentIndex + 1} / ${total}`;
    const pct = ((currentIndex + 1) / total) * 100;
    DOM.progressFill.style.width = `${pct}%`;

    // Meta
    DOM.qChapter.textContent = `Lec ${String(q.lecture).padStart(2, '0')}`;
    DOM.qType.textContent = q.type.toUpperCase();
    DOM.qSource.textContent = q.source === 'student' ? "Student's Effort" : 'Testbank';

    DOM.qSolvedBadge.classList.toggle('hidden', !Storage.isSolved(q.id));
    DOM.qWrongBadge.classList.toggle('hidden', !Storage.isWrong(q.id));

    // Figure
    if (q.figure) {
      DOM.qFigure.classList.remove('hidden');
      DOM.qFigureImg.src = q.figure;
      DOM.qFigureImg.alt = 'Question figure';
    } else {
      DOM.qFigure.classList.add('hidden');
      DOM.qFigureImg.src = '';
    }

    // Content
    DOM.qText.textContent = q.question || '';
    DOM.qChoices.innerHTML = '';
    DOM.qHintBlock.classList.add('hidden');
    DOM.qHintText.textContent = '';
    DOM.qAnswerBlock.classList.add('hidden');
    DOM.qAnswerContent.innerHTML = '';

    DOM.revealBtn.classList.add('hidden');
    DOM.gotRightBtn.classList.add('hidden');
    DOM.gotWrongBtn.classList.add('hidden');

    const state = answeredState[q.id] || { answered: false, selectedIndex: null, judged: false };

    if (q.type === 'mcq' || q.type === 'tf') {
      renderChoiceQuestion(q, state);
    } else {
      renderRevealQuestion(q, state);
    }

    DOM.prevBtn.disabled = currentIndex === 0;
    DOM.nextBtn.textContent = currentIndex === total - 1 ? 'Finish' : 'Next';
  }

  function renderChoiceQuestion(q, state) {
    const choices = Array.isArray(q.choices) ? q.choices : [];
    choices.forEach((choiceText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choiceText;
      btn.disabled = state.answered;

      if (state.answered) {
        const isCorrect = idx === q.answer;
        const isSelected = idx === state.selectedIndex;
        if (isCorrect) btn.classList.add('correct');
        if (isSelected && !isCorrect) btn.classList.add('wrong');
      }

      btn.addEventListener('click', () => handleChoiceAnswer(q, idx));
      DOM.qChoices.appendChild(btn);
    });

    if (state.answered && q.hint) {
      DOM.qHintBlock.classList.remove('hidden');
      DOM.qHintText.textContent = q.hint;
    }
  }

  function renderRevealQuestion(q, state) {
    DOM.revealBtn.classList.remove('hidden');

    if (state.answered) {
      DOM.qAnswerBlock.classList.remove('hidden');
      DOM.gotRightBtn.classList.remove('hidden');
      DOM.gotWrongBtn.classList.remove('hidden');
      renderAnswerContent(q);
    }

    DOM.revealBtn.onclick = () => {
      answeredState[q.id] = { ...state, answered: true };
      DOM.qAnswerBlock.classList.remove('hidden');
      DOM.gotRightBtn.classList.remove('hidden');
      DOM.gotWrongBtn.classList.remove('hidden');
      renderAnswerContent(q);
    };

    DOM.gotRightBtn.onclick = () => {
      Storage.markSolved(q.id);
      updateStatusBadges(q.id);
      showToast('Marked as solved');
    };

    DOM.gotWrongBtn.onclick = () => {
      Storage.markWrong(q.id);
      updateStatusBadges(q.id);
      showToast('Marked as wrong');
    };
  }

  function renderAnswerContent(q) {
    if (q.type === 'list' && Array.isArray(q.answer)) {
      const ul = document.createElement('ul');
      q.answer.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      DOM.qAnswerContent.innerHTML = '';
      DOM.qAnswerContent.appendChild(ul);
      return;
    }

    DOM.qAnswerContent.textContent = Array.isArray(q.answer)
      ? q.answer.join(', ')
      : String(q.answer ?? '');
  }

  function handleChoiceAnswer(q, selectedIndex) {
    const isCorrect = selectedIndex === q.answer;
    answeredState[q.id] = {
      answered: true,
      selectedIndex,
      judged: isCorrect,
    };

    if (isCorrect) {
      Storage.markSolved(q.id);
      showToast('Correct! Marked as solved', 'success');
    } else {
      Storage.markWrong(q.id);
      showToast('Wrong answer. Marked as wrong', 'error');
    }

    renderQuestion();
  }

  function updateStatusBadges(questionId) {
    DOM.qSolvedBadge.classList.toggle('hidden', !Storage.isSolved(questionId));
    DOM.qWrongBadge.classList.toggle('hidden', !Storage.isWrong(questionId));
  }

  function goNext() {
    if (isOnCompletionScreen) return;
    if (currentIndex < filteredQuestions.length - 1) {
      currentIndex += 1;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  function goPrev() {
    if (isOnCompletionScreen) return;
    if (currentIndex > 0) {
      currentIndex -= 1;
      renderQuestion();
    }
  }

  function finishQuiz() {
    isOnCompletionScreen = true;
    showToast('Quiz completed! Returning home...');
    setTimeout(() => {
      showScreen(DOM.homeScreen);
      updateQuestionCount();
      isOnCompletionScreen = false;
    }, 900);
  }

  // ===== SETTINGS / IMPORT / EXPORT =====
  function openSettings() {
    DOM.settingsModal.classList.remove('hidden');
  }

  function closeSettings() {
    DOM.settingsModal.classList.add('hidden');
  }

  function exportData() {
    const blob = new Blob([Storage.exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `os-review-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Data exported');
  }

  function importDataFromFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const result = Storage.importData(String(reader.result || ''));
      if (result.success) {
        applyTheme(Storage.getTheme());
        restorePreferences();
        updateQuestionCount();
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'error');
      }
    };
    reader.readAsText(file);
  }

  function resetLectureProgress() {
    const lectureNum = parseInt(DOM.resetChapterSelect.value, 10);
    Storage.resetChapter(lectureNum);
    updateQuestionCount();
    showToast(`Lecture ${String(lectureNum).padStart(2, '0')} progress reset`);
  }

  function resetAllProgress() {
    Storage.resetAll();
    updateQuestionCount();
    showToast('All progress reset');
  }

  // ===== EVENTS =====
  function bindEvents() {
    // Start
    DOM.startBtn.addEventListener('click', startQuiz);

    // Preference changes
    document.body.addEventListener('change', (e) => {
      const t = e.target;
      if (!t) return;

      if (
        t.matches('input[name="chapter"]') ||
        t.matches('input[name="source"]') ||
        t.matches('input[name="type"]')
      ) {
        updateQuestionCount();
        return;
      }

      if (t.id === 'filter-solved' && t.checked) {
        DOM.filterWrong.checked = false;
      }
      if (t.id === 'filter-wrong' && t.checked) {
        DOM.filterSolved.checked = false;
      }

      if (t.id === 'filter-solved' || t.id === 'filter-wrong' || t.id === 'filter-random') {
        updateQuestionCount();
      }
    });

    // Select/Deselect all
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('button.link-btn');
      if (!btn) return;

      const selectAllGroup = btn.getAttribute('data-select-all');
      const deselectAllGroup = btn.getAttribute('data-deselect-all');

      if (selectAllGroup) {
        $$(`input[name="${selectAllGroup}"]`).forEach((cb) => { cb.checked = true; });
        updateQuestionCount();
      }

      if (deselectAllGroup) {
        $$(`input[name="${deselectAllGroup}"]`).forEach((cb) => { cb.checked = false; });
        updateQuestionCount();
      }
    });

    // Quiz navigation
    DOM.backBtn.addEventListener('click', () => {
      showScreen(DOM.homeScreen);
      updateQuestionCount();
    });
    DOM.prevBtn.addEventListener('click', goPrev);
    DOM.nextBtn.addEventListener('click', goNext);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!DOM.quizScreen.classList.contains('active')) return;
      if (DOM.settingsModal && !DOM.settingsModal.classList.contains('hidden')) return;

      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        goPrev();
      } else if (e.key === ' ' || e.key === 'Enter') {
        const q = filteredQuestions[currentIndex];
        if (!q) return;
        if (q.type !== 'mcq' && q.type !== 'tf' && DOM.revealBtn && !DOM.revealBtn.classList.contains('hidden')) {
          DOM.revealBtn.click();
        }
      }
    });

    // Settings
    DOM.settingsBtn.addEventListener('click', openSettings);
    DOM.quizSettingsBtn.addEventListener('click', openSettings);
    DOM.closeSettings.addEventListener('click', closeSettings);
    DOM.settingsModal.querySelector('.modal-overlay').addEventListener('click', closeSettings);

    DOM.themeToggle.addEventListener('click', () => {
      const next = Storage.toggleTheme();
      applyTheme(next);
    });

    DOM.exportBtn.addEventListener('click', exportData);
    DOM.importBtn.addEventListener('click', () => DOM.importFile.click());
    DOM.importFile.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) importDataFromFile(file);
      DOM.importFile.value = '';
    });

    DOM.resetChapterBtn.addEventListener('click', resetLectureProgress);
    DOM.resetAllBtn.addEventListener('click', resetAllProgress);
  }

  // ===== TOAST =====
  let toastTimer = null;
  function showToast(message, type = 'info') {
    DOM.toast.textContent = message;
    DOM.toast.className = `toast ${type}`;
    DOM.toast.classList.remove('hidden');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      DOM.toast.classList.add('hidden');
    }, 1800);
  }

  // Public API
  return { init };
})();

// Init on load
document.addEventListener('DOMContentLoaded', App.init);
