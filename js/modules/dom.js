import { $, $$ } from './utils.js';

export const DOM = {};

export function cacheDom() {
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
