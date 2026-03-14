import { DOM } from './dom.js';
import { Storage } from './storage.js';
import { showToast, applyTheme } from './ui.js';
import { restorePreferences } from './preferences.js';

export function openSettings() {
  DOM.settingsModal.classList.remove('hidden');
}

export function closeSettings() {
  DOM.settingsModal.classList.add('hidden');
}

export function exportData() {
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

export function importDataFromFile(file, updateQuestionCount) {
  const reader = new FileReader();
  reader.onload = () => {
    const result = Storage.importData(String(reader.result || ''));
    if (result.success) {
      applyTheme(Storage.getTheme());
      restorePreferences();
      if (typeof updateQuestionCount === 'function') updateQuestionCount();
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
  };
  reader.readAsText(file);
}

export function resetLectureProgress(updateQuestionCount) {
  const lectureNum = parseInt(DOM.resetChapterSelect.value, 10);
  Storage.resetLecture(lectureNum);
  if (typeof updateQuestionCount === 'function') updateQuestionCount();
  showToast(`Lecture ${String(lectureNum).padStart(2, '0')} progress reset`);
}

export function resetAllProgress(updateQuestionCount) {
  Storage.resetAll();
  if (typeof updateQuestionCount === 'function') updateQuestionCount();
  showToast('All progress reset');
}
