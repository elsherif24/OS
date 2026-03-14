// ===== LECTURE 03: Computer Systems Overview — STUDENT =====
// Student-added questions only. Testbank questions are in lec03 (js/testbank/lec03.js)
// See GUIDE.md for how to add/edit questions.

if (typeof window.ALL_QUESTIONS === 'undefined') {
  window.ALL_QUESTIONS = [];
}

(function () {
  const lec03_student = [
    // ==================== TRUE / FALSE ====================
    // {
    //   id: 'lec03_tf_s001',
    //   chapter: 1,
    //   source: 'student',
    //   type: 'tf',
    //   question: 'Statement goes here.',
    //   choices: ['True', 'False'],
    //   answer: 0,   // 0 = True, 1 = False
    //   hint: null,
    //   figure: null,
    // },

    // ==================== MULTIPLE CHOICE ====================
    // {
    //   id: 'lec03_mcq_s001',
    //   chapter: 1,
    //   source: 'student',
    //   type: 'mcq',
    //   question: 'Question text here?',
    //   choices: ['Option A', 'Option B', 'Option C', 'Option D'],
    //   answer: 0,
    //   hint: null,
    //   figure: null,
    // },

    // ==================== LIST ====================
    // {
    //   id: 'lec03_list_s001',
    //   chapter: 1,
    //   source: 'student',
    //   type: 'list',
    //   question: 'List the ...',
    //   choices: null,
    //   answer: ['Item 1', 'Item 2', 'Item 3'],
    //   figure: null,
    // },

    // ==================== DEFINE ====================
    // {
    //   id: 'lec03_define_s001',
    //   chapter: 1,
    //   source: 'student',
    //   type: 'define',
    //   question: 'Define ...',
    //   choices: null,
    //   answer: 'Definition goes here.',
    //   figure: null,
    // },

    // ==================== FILL IN THE BLANK ====================
    // {
    //   id: 'lec03_fill_s001',
    //   chapter: 1,
    //   source: 'student',
    //   type: 'fill',
    //   question: 'The ________ does something.',
    //   choices: null,
    //   answer: 'answer',
    //   figure: null,
    // },
  ];

  const LECTURE = 3;
  const SOURCE = 'student';
  window.ALL_QUESTIONS.push(...lec03_student.map(q => ({ ...q, lecture: LECTURE, source: SOURCE })));
})();
