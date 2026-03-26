import { DOM, cacheDom } from './modules/dom.js';
import { $, $$ } from './modules/utils.js';
import { Storage } from './modules/storage.js';
import { applyTheme, buildLectureCheckboxes, buildResetLectureSelect, showScreen } from './modules/ui.js';
import { enrichQuestions } from './modules/questions.js';
import { restorePreferences } from './modules/preferences.js';
import { getFilteredQuestions } from './modules/quizFilter.js';
import { startQuiz, goNext, goPrev, toggleStar, filteredQuestions, currentIndex } from './modules/quiz.js';
import { openSettings, closeSettings, exportData, importDataFromFile, resetLectureProgress, resetAllProgress } from './modules/settings.js';

// ===== GLOBAL QUESTION BANK =====
if (typeof window.ALL_QUESTIONS === 'undefined') {
  window.ALL_QUESTIONS = [];
}

const TOTAL_LECTURES = 4;

function updateQuestionCount() {
  const count = getFilteredQuestions().length;
  DOM.countPreview.textContent = `${count} question${count !== 1 ? 's' : ''} match your selection`;
  DOM.startBtn.disabled = count === 0;
}

function init() {
  cacheDom();
  enrichQuestions();
  applyTheme(Storage.getTheme());
  buildLectureCheckboxes(TOTAL_LECTURES);
  buildResetLectureSelect(TOTAL_LECTURES);
  restorePreferences();
  bindEvents();
  updateQuestionCount();
}

function bindEvents() {
  // Start
  DOM.startBtn.addEventListener('click', () => startQuiz(updateQuestionCount));

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

    if (t.id === 'filter-solved' || t.id === 'filter-wrong' || t.id === 'filter-starred' || t.id === 'filter-random') {
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
  DOM.prevBtn.addEventListener('click', () => goPrev(updateQuestionCount));
  DOM.nextBtn.addEventListener('click', () => goNext(updateQuestionCount));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!DOM.quizScreen.classList.contains('active')) return;
    if (DOM.settingsModal && !DOM.settingsModal.classList.contains('hidden')) return;

    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
      goNext(updateQuestionCount);
    } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
      goPrev(updateQuestionCount);
    } else if (e.key === ' ' || e.key === 'Enter') {
      if (e.key === ' ') e.preventDefault();
      const q = filteredQuestions[currentIndex];
      if (!q) return;
      if (q.type !== 'mcq' && q.type !== 'tf' && DOM.revealBtn && !DOM.revealBtn.classList.contains('hidden')) {
        DOM.revealBtn.click();
      }
    } else if (e.key.toLowerCase() === 's') {
      toggleStar();
    } else if (/^[1-9]$/.test(e.key)) {
      const q = filteredQuestions[currentIndex];
      if (!q) return;
      if (q.type === 'mcq' || q.type === 'tf') {
        // Number keys select MCQ/TF choices
        const choiceIndex = parseInt(e.key, 10) - 1;
        const choiceBtns = DOM.qChoices.querySelectorAll('.choice-btn');
        if (choiceBtns[choiceIndex] && !choiceBtns[choiceIndex].disabled) {
          choiceBtns[choiceIndex].click();
        }
      } else {
        // For reveal-type questions (list/define/fill):
        // 1 = Reveal Answer (before reveal) OR Got it Right (after reveal)
        // 2 = Got it Wrong (after reveal)
        const revealVisible = DOM.revealBtn && !DOM.revealBtn.classList.contains('hidden');
        const gotRightVisible = DOM.gotRightBtn && !DOM.gotRightBtn.classList.contains('hidden');
        const gotWrongVisible = DOM.gotWrongBtn && !DOM.gotWrongBtn.classList.contains('hidden');

        if (e.key === '1') {
          if (revealVisible) {
            DOM.revealBtn.click();
          } else if (gotRightVisible) {
            DOM.gotRightBtn.click();
          }
        } else if (e.key === '2' && gotWrongVisible) {
          DOM.gotWrongBtn.click();
        }
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
    if (file) importDataFromFile(file, updateQuestionCount);
    DOM.importFile.value = '';
  });

  DOM.resetChapterBtn.addEventListener('click', () => resetLectureProgress(updateQuestionCount));
  DOM.resetAllBtn.addEventListener('click', () => resetAllProgress(updateQuestionCount));
}

// Init on load
document.addEventListener('DOMContentLoaded', init);
