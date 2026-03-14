import { DOM } from './dom.js';

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (DOM.themeLabel) {
    DOM.themeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
  }
}

export function buildLectureCheckboxes(totalLectures) {
  let html = '';
  for (let i = 1; i <= totalLectures; i++) {
    const num = String(i).padStart(2, '0');
    html += `
      <label class="chip">
        <input type="checkbox" name="chapter" value="${i}" checked>
        <span>Lecture ${num}</span>
      </label>`;
  }
  DOM.chapterCheckboxes.innerHTML = html;
}

export function buildResetLectureSelect(totalLectures) {
  let html = '';
  for (let i = 1; i <= totalLectures; i++) {
    const num = String(i).padStart(2, '0');
    html += `<option value="${i}">Lecture ${num}</option>`;
  }
  DOM.resetChapterSelect.innerHTML = html;
}

export function showScreen(screen) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  screen.classList.add('active');
  window.scrollTo(0, 0);
}

let toastTimer = null;
export function showToast(message, type = 'info') {
  DOM.toast.textContent = message;
  DOM.toast.className = `toast ${type}`;
  DOM.toast.classList.remove('hidden');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    DOM.toast.classList.add('hidden');
  }, 1800);
}
