import { normalizeText, fnv1aHex } from './utils.js';

export function buildQuestionId({ lecture, source, type, question }) {
  const nn = String(lecture).padStart(2, '0');
  const payload = normalizeText(question);
  const hash = fnv1aHex(payload);
  return `lec_${nn}_${source}_${type}_${hash}`;
}

export function inferLectureFromQuestionText(questionText) {
  // Fallback-only heuristic when lecture isn't present:
  // finds patterns like "lecture 01", "lec01", "lec 1"
  const t = String(questionText || '').toLowerCase();
  const m = t.match(/\b(?:lecture|lec)\s*0?([1-9]\d?)\b/);
  if (m) return parseInt(m[1], 10);
  return 1;
}

export function inferSourceFromQuestionShape(q) {
  // Conservative fallback: if we don't know, assume testbank
  // (source should ideally be set in data-loader context)
  if (q && (q.source === 'student' || q.source === 'testbank')) {
    return q.source;
  }
  return 'testbank';
}

export function enrichQuestions() {
  if (!window.ALL_QUESTIONS) window.ALL_QUESTIONS = [];

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
      type, // Preserving normalized lowercase type
      lecture,
      source,
      id,
    };
  });
}
