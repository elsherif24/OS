import { DOM } from './dom.js';
import { Storage } from './storage.js';
import { showToast, showScreen } from './ui.js';
import { savePreferences } from './preferences.js';
import { getFilteredQuestions } from './quizFilter.js';

export let filteredQuestions = [];
export let currentIndex = 0;
export let answeredState = {};
export let isOnCompletionScreen = false;

export function setFilteredQuestions(qs) { filteredQuestions = qs; }
export function setCurrentIndex(idx) { currentIndex = idx; }
export function setAnsweredState(state) { answeredState = state; }
export function setIsOnCompletionScreen(val) { isOnCompletionScreen = val; }

export function startQuiz(updateQuestionCount) {
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
  renderQuestion(updateQuestionCount);
}

export function renderQuestion(updateQuestionCount) {
  if (filteredQuestions.length === 0) return;

  const q = filteredQuestions[currentIndex];
  const total = filteredQuestions.length;

  DOM.progressText.textContent = `${currentIndex + 1} / ${total}`;
  const pct = ((currentIndex + 1) / total) * 100;
  DOM.progressFill.style.width = `${pct}%`;

  DOM.qChapter.textContent = `Lec ${String(q.lecture).padStart(2, '0')}`;
  DOM.qType.textContent = q.type.toUpperCase();
  DOM.qSource.textContent = q.source === 'student' ? "Student's Effort" : 'Testbank';

  DOM.qSolvedBadge.classList.toggle('hidden', !Storage.isSolved(q.id));
  DOM.qWrongBadge.classList.toggle('hidden', !Storage.isWrong(q.id));

  if (q.figure) {
    DOM.qFigure.classList.remove('hidden');
    DOM.qFigureImg.src = q.figure;
    DOM.qFigureImg.alt = 'Question figure';
  } else {
    DOM.qFigure.classList.add('hidden');
    DOM.qFigureImg.src = '';
  }

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
    renderChoiceQuestion(q, state, updateQuestionCount);
  } else {
    renderRevealQuestion(q, state, updateQuestionCount);
  }

  DOM.prevBtn.disabled = currentIndex === 0;
  DOM.nextBtn.textContent = currentIndex === total - 1 ? 'Finish' : 'Next';
}

function renderChoiceQuestion(q, state, updateQuestionCount) {
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

    btn.addEventListener('click', () => handleChoiceAnswer(q, idx, updateQuestionCount));
    DOM.qChoices.appendChild(btn);
  });

  if (state.answered && q.hint) {
    DOM.qHintBlock.classList.remove('hidden');
    DOM.qHintText.textContent = q.hint;
  }
}

function renderRevealQuestion(q, state, updateQuestionCount) {
  if (state.answered) {
    DOM.revealBtn.classList.add('hidden');
    DOM.qAnswerBlock.classList.remove('hidden');
    DOM.gotRightBtn.classList.remove('hidden');
    DOM.gotWrongBtn.classList.remove('hidden');
    renderAnswerContent(q);
  } else {
    DOM.revealBtn.classList.remove('hidden');
  }

  DOM.revealBtn.onclick = () => {
    answeredState[q.id] = { ...state, answered: true };
    DOM.revealBtn.classList.add('hidden');
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

function handleChoiceAnswer(q, selectedIndex, updateQuestionCount) {
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

  renderQuestion(updateQuestionCount);
}

function updateStatusBadges(questionId) {
  DOM.qSolvedBadge.classList.toggle('hidden', !Storage.isSolved(questionId));
  DOM.qWrongBadge.classList.toggle('hidden', !Storage.isWrong(questionId));
}

export function goNext(updateQuestionCount) {
  if (isOnCompletionScreen) return;
  if (currentIndex < filteredQuestions.length - 1) {
    currentIndex += 1;
    renderQuestion(updateQuestionCount);
  } else {
    finishQuiz(updateQuestionCount);
  }
}

export function goPrev(updateQuestionCount) {
  if (isOnCompletionScreen) return;
  if (currentIndex > 0) {
    currentIndex -= 1;
    renderQuestion(updateQuestionCount);
  }
}

export function finishQuiz(updateQuestionCount) {
  isOnCompletionScreen = true;
  showToast('Quiz completed! Returning home...');
  setTimeout(() => {
    showScreen(DOM.homeScreen);
    updateQuestionCount();
    isOnCompletionScreen = false;
  }, 900);
}
