// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
  SOLVED: 'os_review_solved',
  WRONG: 'os_review_wrong',
  THEME: 'os_review_theme',
  PREFERENCES: 'os_review_preferences',
};

// ===== STORAGE MODULE =====
const Storage = (() => {
  // --- Solved Questions ---

  function getSolved() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SOLVED);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read solved data:', e);
      return [];
    }
  }

  function setSolved(solvedArray) {
    try {
      localStorage.setItem(STORAGE_KEYS.SOLVED, JSON.stringify(solvedArray));
    } catch (e) {
      console.error('Failed to save solved data:', e);
    }
  }

  function markSolved(questionId) {
    const solved = getSolved();
    if (!solved.includes(questionId)) {
      solved.push(questionId);
      setSolved(solved);
    }
    // If it was previously marked wrong, remove it from wrong
    unmarkWrong(questionId);
  }

  function unmarkSolved(questionId) {
    const solved = getSolved().filter((id) => id !== questionId);
    setSolved(solved);
  }

  function isSolved(questionId) {
    return getSolved().includes(questionId);
  }

  function resetLectureSolved(lectureNum) {
    const prefix = `lec_${String(lectureNum).padStart(2, '0')}_`;
    const solved = getSolved().filter((id) => !id.startsWith(prefix));
    setSolved(solved);
  }

  function resetAllSolved() {
    setSolved([]);
  }

  function getSolvedCount() {
    return getSolved().length;
  }

  function getSolvedCountForLecture(lectureNum) {
    const prefix = `lec_${String(lectureNum).padStart(2, '0')}_`;
    return getSolved().filter((id) => id.startsWith(prefix)).length;
  }

  // --- Wrong Questions ---

  function getWrong() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WRONG);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read wrong data:', e);
      return [];
    }
  }

  function setWrong(wrongArray) {
    try {
      localStorage.setItem(STORAGE_KEYS.WRONG, JSON.stringify(wrongArray));
    } catch (e) {
      console.error('Failed to save wrong data:', e);
    }
  }

  function markWrong(questionId) {
    const wrong = getWrong();
    if (!wrong.includes(questionId)) {
      wrong.push(questionId);
      setWrong(wrong);
    }
    // If it was previously marked solved, remove it from solved
    unmarkSolved(questionId);
  }

  function unmarkWrong(questionId) {
    const wrong = getWrong().filter((id) => id !== questionId);
    setWrong(wrong);
  }

  function isWrong(questionId) {
    return getWrong().includes(questionId);
  }

  function resetLectureWrong(lectureNum) {
    const prefix = `lec_${String(lectureNum).padStart(2, '0')}_`;
    const wrong = getWrong().filter((id) => !id.startsWith(prefix));
    setWrong(wrong);
  }

  function resetAllWrong() {
    setWrong([]);
  }

  function getWrongCount() {
    return getWrong().length;
  }

  function getWrongCountForLecture(lectureNum) {
    const prefix = `lec_${String(lectureNum).padStart(2, '0')}_`;
    return getWrong().filter((id) => id.startsWith(prefix)).length;
  }

  // --- Combined Reset (solved + wrong) ---

  function resetLecture(lectureNum) {
    resetLectureSolved(lectureNum);
    resetLectureWrong(lectureNum);
  }

  function resetAll() {
    resetAllSolved();
    resetAllWrong();
  }

  // --- Theme ---

  function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  }

  function setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  function toggleTheme() {
    const current = getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    return next;
  }

  // --- Preferences ---

  function getPreferences() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to read preferences:', e);
      return null;
    }
  }

  function setPreferences(prefs) {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.error('Failed to save preferences:', e);
    }
  }

  // --- Import / Export ---

  function exportData() {
    const data = {
      solved: getSolved(),
      wrong: getWrong(),
      theme: getTheme(),
      preferences: getPreferences(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  function importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);

      if (data.solved && Array.isArray(data.solved)) {
        setSolved(data.solved);
      }
      if (data.wrong && Array.isArray(data.wrong)) {
        setWrong(data.wrong);
      }
      if (data.theme && (data.theme === 'dark' || data.theme === 'light')) {
        setTheme(data.theme);
      }
      if (data.preferences && typeof data.preferences === 'object') {
        setPreferences(data.preferences);
      }

      return { success: true, message: 'Data imported successfully' };
    } catch (e) {
      console.error('Failed to import data:', e);
      return { success: false, message: 'Invalid JSON file' };
    }
  }

  // --- Public API ---
  return {
    getSolved,
    setSolved,
    markSolved,
    unmarkSolved,
    isSolved,
    resetLectureSolved,
    resetAllSolved,
    getSolvedCount,
    getSolvedCountForLecture,
    getWrong,
    setWrong,
    markWrong,
    unmarkWrong,
    isWrong,
    resetLectureWrong,
    resetAllWrong,
    getWrongCount,
    getWrongCountForLecture,
    resetLecture,
    resetAll,
    getTheme,
    setTheme,
    toggleTheme,
    getPreferences,
    setPreferences,
    exportData,
    importData,
  };
})();
