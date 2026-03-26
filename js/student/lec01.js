// ===== LECTURE 01: Computer Systems Overview — STUDENT =====
// Student-added questions only. Testbank questions are in lec01 (js/testbank/lec01.js)
// See GUIDE.md for how to add/edit questions.

if (typeof window.ALL_QUESTIONS === 'undefined') {
  window.ALL_QUESTIONS = [];
}

(function () {
  const lec01_student = [
    // ==================== TRUE / FALSE ====================
    {
      type: 'tf',
      question: 'Condition codes in the Program Status Word (PSW) are typically visible registers that can be directly changed by user software at any time.',
      choices: ['True', 'False'],
      answer: 1,
      hint: 'Condition codes are typically set by the processor hardware as a result of operations, not set directly by user software.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'In a multi-core design, on-chip communication between cores is generally faster than communication between independent, separate single-core chips.',
      choices: ['True', 'False'],
      answer: 0,
      hint: null,
      figure: null,
    },
    {
      type: 'tf',
      question: 'Secondary memory devices, such as disks, are considered to be external environment devices connecting via I/O Modules.',
      choices: ['True', 'False'],
      answer: 0,
      hint: null,
      figure: null,
    },
    {
      type: 'tf',
      question: 'The Principle of Locality states that memory references by the processor tend to be evenly distributed across all memory locations.',
      choices: ['True', 'False'],
      answer: 1,
      hint: 'The Principle of Locality states that memory references by the processor tend to cluster.',
      figure: null,
    },

    // ==================== MULTIPLE CHOICE ====================
    {
      type: 'mcq',
      question: 'Which of the following processor registers is used to hold the status results of recent operations?',
      choices: [
        'Instruction Register (IR)',
        'Memory Address Register (MAR)',
        'Condition Codes',
        'Program Counter (PC)'
      ],
      answer: 2,
      hint: null,
      figure: null,
    },
    {
      type: 'mcq',
      question: 'The architecture where one machine is exclusively in hot-standby mode while others run applications is known as:',
      choices: [
        'Symmetric Multiprocessing',
        'Symmetric Clustering',
        'Asymmetric Multiprocessing',
        'Asymmetric Clustering'
      ],
      answer: 3,
      hint: 'In an asymmetric clustering setup, a hot-standby machine does nothing but monitor the active servers until a failure occurs.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'What is the most significant disadvantage of using Programmed I/O?',
      choices: [
        'It requires excessively complex circuitry on the processor.',
        'It generates too many interrupts per byte transferred.',
        'Polling for the device status wastes CPU cycles needlessly.',
        'It can only handle small volumes of data transfer.'
      ],
      answer: 2,
      hint: 'The processor must periodically check the status (polling) and wait, wasting execution cycles.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'Which characteristic generally decreases as you move down the computer memory hierarchy (from registers toward secondary memory)?',
      choices: [
        'Total capacity',
        'Access time',
        'Cost per bit',
        'Memory latency'
      ],
      answer: 2,
      hint: 'Going down the hierarchy means decreasing cost per bit, increasing capacity, and increasing access time.',
      figure: null,
    },

    // ==================== LIST ====================
    {
      type: 'list',
      question: 'List the three techniques possible for executing I/O operations.',
      choices: null,
      answer: [
        'Programmed I/O',
        'Interrupt-Driven I/O',
        'Direct Memory Access (DMA)'
      ],
      figure: null,
    },
    {
      type: 'list',
      question: 'List the two general classes of Processor Registers according to the provided material.',
      choices: null,
      answer: [
        'User Visible Registers',
        'Control and Status Registers'
      ],
      figure: null,
    },

    // ==================== DEFINE ====================
    {
      type: 'define',
      question: 'Define the "Fetch" step in the basic instruction cycle.',
      choices: null,
      answer: 'The step where the processor retrieves the instruction from memory, usually using the address held in the Program Counter (PC).',
      figure: null,
    },

    // ==================== FILL IN THE BLANK ====================
    {
      type: 'fill',
      question: 'GPUs provide efficient computation on arrays of data using a _________ technique pioneered in supercomputers.',
      choices: null,
      answer: 'Single Instruction Multiple Data (SIMD)',
      figure: null,
    },
    {
      type: 'fill',
      question: 'In the instruction cycle with interrupts, if an interrupt is pending, the processor suspends execution of the current program and executes the __________.',
      choices: null,
      answer: 'interrupt handler',
      figure: null,
    },
    {
      type: 'fill',
      question: 'The two approaches to handle multiple interrupts are disabling interrupts during interrupt processing and using a __________ scheme.',
      choices: null,
      answer: 'priority',
      figure: null,
    }
  ];

  const LECTURE = 1;
  const SOURCE = 'student';
  window.ALL_QUESTIONS.push(...lec01_student.map(q => ({ ...q, lecture: LECTURE, source: SOURCE })));
})();
