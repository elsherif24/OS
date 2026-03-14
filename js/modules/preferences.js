import { $$ } from './utils.js';
import { DOM } from './dom.js';
import { Storage } from './storage.js';

export function gatherPreferences() {
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

export function restorePreferences() {
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

export function savePreferences() {
  Storage.setPreferences(gatherPreferences());
}
