// ===== LECTURE 03: Computer Systems Overview — STUDENT =====

if (typeof window.ALL_QUESTIONS === 'undefined') {
  window.ALL_QUESTIONS = [];
}

(function () {
  const lec03_student = [
    // ==================== TRUE / FALSE ====================
    {
      type: 'tf',
      question: 'The processor itself provides only limited support for multiprogramming',
      choices: ['True', 'False'],
      answer: 0,   // 0 = True, 1 = False
      hint: 'Yes, and Software is needed to manage the sharing of the processor and other resources by multiple applications at the same time',
      figure: null,
    },
    {
      type: 'tf',
      question: 'Program code of the process can\'t be shared among multiple processes that are executing the same program.',
      choices: ['True', 'False'],
      answer: 1,   // 0 = True, 1 = False
      hint: 'Program code of the process CAN be shared among multiple processes that are executing the same program',
      figure: null,
    },
    {
      type: 'tf',
      question: 'Two processes executing at the same time can have the same identifier.',
      choices: ['True', 'False'],
      answer: 1,   // 0 = True, 1 = False
      hint: 'Each process has a unique identifier associated with this process, to distinguish it from all other processes.',
      figure: null,
    },
    {
      type: 'tf',
      question: '',
      choices: ['True', 'False'],
      answer: 0,   // 0 = True, 1 = False
      hint: '',
      figure: null,
    },

    // ==================== MULTIPLE CHOICE ====================
    {
      type: 'mcq',
      question: 'Which of the following is a definition of a \"Process\"?',
      choices: ['A program in execution', 'An instance of a program running on a computer', 'The entity that can be assigned to and executed on a processor', 'A unit of activity characterized by the execution of a sequence of instructions, a current state, and an associated set of system resources', 'All of the above'],
      answer: 4,
      hint: null,
      figure: null,
    },
    {
      type: 'mcq',
      question: 'What are the two essential elements of a process?',
      choices: ['Process ID', 'Program Counter', 'Memory Address', 'Program Code & a set of data associated with that code'],
      answer: 3,
      hint: null,
      figure: null,
    },
    {
      type: 'mcq',
      question: 'Question text here?',
      choices: ['Option A', 'Option B', 'Option C', 'Option D'],
      answer: 0,
      hint: null,
      figure: null,
    },

    // ==================== LIST ====================
    {
      type: 'list',
      question: 'List the 8 uniquely identifiable elements of a process.',
      choices: null,
      answer: ['Identifier', 'State', 'Priority', 'Program Counter', 'Memory Pointers', 'Context Data', 'I/O Status Information', 'Accounting Information'],
      figure: null,
    },

    // ==================== DEFINE ====================
    {
      type: 'define',
      question: 'Define what a process is.', 
      choices: null,
      answer: 'A process is a unit of activity characterized by the execution of a sequence of instructions, a current state, and an associated set of system resources.',
      figure: null,
    },

    // ==================== FILL IN THE BLANK ====================
    {
      type: 'fill',
      question: 'The ______ Include pointers to the program code and data associated with this process, plus and memory blocks shared with other processes.',
      choices: null,
      answer: 'Memory Pointers',
      figure: null,
    },
    {
      type: 'fill',
      question: '______ These are data that are present in registers in the processor while the process is executing.',
      choices: null,
      answer: 'Context Data',
      figure: null,
    },
    {
      type: 'fill',
      question: '______ Includes outstanding I/O requests, I/O devices assigned to this process, a list of files in use by the process and so on',
      choices: null,
      answer: 'I/O Status Information',
      figure: null,
    },
    {
      type: 'fill',
      question: '______ May include the amount of processor time and clock time used, time limits, account numbers and so on.',
      choices: null,
      answer: 'Accounting Information',
      figure: null,
    },
    {
      type: 'fill',
      question: 'The ________ does something.',
      choices: null,
      answer: 'answer',
      figure: null,
    },
  ];

  const LECTURE = 3;
  const SOURCE = 'student';
  window.ALL_QUESTIONS.push(...lec03_student.map(q => ({ ...q, lecture: LECTURE, source: SOURCE })));
})();
