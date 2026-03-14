// ===== CHAPTER 10 =====
// See GUIDE.md for how to add/edit questions.

if (typeof window.ALL_QUESTIONS === 'undefined') {
  window.ALL_QUESTIONS = [];
}

(function () {
  const ch10 = [
    // Add your questions here. Examples:
    //
    // {
    //   id: 'ch10_mcq_001',
    //   chapter: 10,
    //   source: 'testbank',   // 'testbank' | 'student'
    //   type: 'mcq',          // 'mcq' | 'tf' | 'list' | 'define' | 'fill'
    //   question: 'Your question text here?',
    //   choices: ['Option A', 'Option B', 'Option C', 'Option D'],
    //   answer: 0,            // index of the correct choice (0-based)
    //   figure: null,         // null or 'images/ch10_some_figure.png'
    // },
    //
    // {
    //   id: 'ch10_tf_001',
    //   chapter: 10,
    //   source: 'student',
    //   type: 'tf',
    //   question: 'Some true/false statement.',
    //   choices: ['True', 'False'],
    //   answer: 0,            // 0 = True, 1 = False
    //   figure: null,
    // },
    //
    // {
    //   id: 'ch10_list_001',
    //   chapter: 10,
    //   source: 'student',
    //   type: 'list',
    //   question: 'List the things.',
    //   choices: null,
    //   answer: ['Item 1', 'Item 2', 'Item 3'],
    //   figure: null,
    // },
    //
    // {
    //   id: 'ch10_define_001',
    //   chapter: 10,
    //   source: 'testbank',
    //   type: 'define',
    //   question: 'Define something.',
    //   choices: null,
    //   answer: 'The definition goes here.',
    //   figure: null,
    // },
    //
    // {
    //   id: 'ch10_fill_001',
    //   chapter: 10,
    //   source: 'testbank',
    //   type: 'fill',
    //   question: 'A ________ does something.',
    //   choices: null,
    //   answer: 'blank answer',
    //   figure: null,
    // },
  ];

  window.ALL_QUESTIONS.push(...ch10);
})();
