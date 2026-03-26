import { gatherPreferences } from './preferences.js';
import { Storage } from './storage.js';
import { shuffleArray } from './utils.js';

export function getFilteredQuestions() {
  const prefs = gatherPreferences();
  const solvedSet = new Set(Storage.getSolved());
  const wrongSet = new Set(Storage.getWrong());
  const starredSet = new Set(Storage.getStarred());

  let questions = window.ALL_QUESTIONS.filter((q) => {
    if (!prefs.lectures.includes(q.lecture)) return false;
    if (!prefs.sources.includes(q.source)) return false;

    const qType = q.type === 'figure' ? q.subtype : q.type;

    if (q.type === 'figure') {
      if (!prefs.types.includes(q.subtype)) return false;
    } else {
      if (!prefs.types.includes(qType)) return false;
    }

    if (prefs.onlyStarred) {
      if (!starredSet.has(q.id)) return false;
    }

    if (prefs.onlyWrong) {
      if (!wrongSet.has(q.id)) return false;
    } else {
      if (!prefs.includeSolved && solvedSet.has(q.id)) return false;
    }

    return true;
  });

  if (prefs.randomize) {
    questions = shuffleArray([...questions]);
  }

  return questions;
}
