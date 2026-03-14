// ===== LECTURE 01: Computer Systems Overview — STUDENT =====
// Student-added questions only. Testbank questions are in lec01 (js/testbank/lec01.js)
// See GUIDE.md for how to add/edit questions.

if (typeof window.ALL_QUESTIONS === 'undefined') {
  window.ALL_QUESTIONS = [];
}

(function () {
  const lec01_student = [
    // ==================== TRUE / FALSE ====================
    // {
    //   type: 'tf',
    //   question: 'Statement goes here.',
    //   choices: ['True', 'False'],
    //   answer: 0,   // 0 = True, 1 = False
    //   hint: null,
    //   figure: null,
    // },

    // ==================== MULTIPLE CHOICE ====================
    // {
    //   type: 'mcq',
    //   question: 'Question text here?',
    //   choices: ['Option A', 'Option B', 'Option C', 'Option D'],
    //   answer: 0,
    //   hint: null,
    //   figure: null,
    // },

    // ==================== LIST ====================
    // {
    //   type: 'list',
    //   question: 'List the ...',
    //   choices: null,
    //   answer: ['Item 1', 'Item 2', 'Item 3'],
    //   figure: null,
    // },

    // ==================== DEFINE ====================
    // {
    //   type: 'define',
    //   question: 'Define ...',
    //   choices: null,
    //   answer: 'Definition goes here.',
    //   figure: null,
    // },

    // ==================== FILL IN THE BLANK ====================
    // {
    //   type: 'fill',
    //   question: 'The ________ does something.',
    //   choices: null,
    //   answer: 'answer',
    //   figure: null,
    // },
  ];

  const LECTURE = 1;
  const SOURCE = 'student';
  window.ALL_QUESTIONS.push(...lec01_student.map(q => ({ ...q, lecture: LECTURE, source: SOURCE })));
})();
