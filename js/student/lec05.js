// ===== LECTURE 05: Mutual Exclusion and Synchronisation — STUDENT =====
// Student-added questions only. Testbank questions are in (js/testbank/lec05.js)
// See GUIDE.md for how to add/edit questions.

if (typeof window.ALL_QUESTIONS === 'undefined') {
  window.ALL_QUESTIONS = [];
}

(function () {
  const lec05_student = [
    // ==================== TRUE / FALSE ====================
    {
      type: 'tf',
      question: 'Disabling interrupts is an effective mutual exclusion solution on multiprocessor systems.',
      choices: ['True', 'False'],
      answer: 1,
      hint: 'Disabling interrupts on one processor does not prevent other processors from executing concurrently, so it is not effective on multiprocessors.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'The `test_and_set` instruction reads a memory word and sets it to TRUE atomically.',
      choices: ['True', 'False'],
      answer: 0,
      hint: '`test_and_set` atomically reads the current value and sets the word to TRUE, returning the original value.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'A strong semaphore uses FIFO ordering to release blocked processes, guaranteeing freedom from starvation.',
      choices: ['True', 'False'],
      answer: 0,
      hint: 'Strong semaphores release the process that has been blocked the longest, preventing starvation.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'In the bounded-buffer producer/consumer solution, the `mutex` semaphore is initialized to 0.',
      choices: ['True', 'False'],
      answer: 1,
      hint: '`mutex` is a binary semaphore initialized to 1 (available). It is `full` that starts at 0 and `empty` at n.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'In the Dining Philosophers problem, all five philosophers picking up their left chopstick simultaneously can lead to deadlock.',
      choices: ['True', 'False'],
      answer: 0,
      hint: 'If every philosopher picks up their left chopstick first, each waits for the right neighbor\'s chopstick — a classic circular deadlock.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'A monitor allows multiple processes to execute inside it simultaneously for better performance.',
      choices: ['True', 'False'],
      answer: 1,
      hint: 'Only one process may be active inside a monitor at a time; invocations by other processes are blocked until the monitor is free.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'In the Readers/Writers problem with readers priority, a writer may starve if readers continuously arrive.',
      choices: ['True', 'False'],
      answer: 0,
      hint: 'When readers have priority, new readers can keep entering as long as at least one reader is active, potentially never giving the writer access.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'Semaphore operations `wait` and `signal` must be executed atomically.',
      choices: ['True', 'False'],
      answer: 0,
      hint: 'If `wait` and `signal` were not atomic, concurrent access to the semaphore value itself could create a race condition.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'In message passing with indirect addressing, messages are sent directly from sender to receiver without any intermediate storage.',
      choices: ['True', 'False'],
      answer: 1,
      hint: 'Indirect addressing routes messages through a shared mailbox (queue); direct addressing sends messages directly to a named process.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'A mutex lock differs from a binary semaphore in that it must be released by the same process that acquired it.',
      choices: ['True', 'False'],
      answer: 0,
      hint: 'A mutex enforces ownership — only the locking process/thread can unlock it, unlike a binary semaphore which can be signaled by any process.',
      figure: null,
    },

    // ==================== MULTIPLE CHOICE ====================
    {
      type: 'mcq',
      question: 'Which of the following is NOT a disadvantage of using hardware interrupt-disabling for mutual exclusion?',
      choices: [
        'A user process can abuse the privilege',
        'It prevents all processes from executing, not just interfering ones',
        'It does not work on multiprocessor systems',
        'It requires a waiting queue data structure',
      ],
      answer: 3,
      hint: 'Waiting queues are a feature of semaphore implementations, not a concern with interrupt-disabling.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'In the bounded-buffer producer/consumer solution using semaphores, what does the `empty` semaphore represent?',
      choices: [
        'The number of full buffer slots',
        'Whether the buffer is locked',
        'The number of empty buffer slots',
        'The number of waiting consumers',
      ],
      answer: 2,
      hint: '`empty` is initialized to n (total buffer size) and counts the available empty slots for a producer to fill.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'What is the correct order of semaphore operations for a producer in the bounded-buffer solution?',
      choices: [
        'wait(mutex) → wait(empty) → signal(full) → signal(mutex)',
        'wait(empty) → wait(mutex) → signal(mutex) → signal(full)',
        'wait(full) → wait(mutex) → signal(mutex) → signal(empty)',
        'wait(mutex) → wait(full) → signal(empty) → signal(mutex)',
      ],
      answer: 1,
      hint: 'The producer must first check space is available (wait empty), then acquire mutual exclusion (wait mutex), write, release mutex, then signal a full slot.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'Which hardware atomic instruction conditionally updates a memory location only if its current value matches an expected value?',
      choices: [
        'test_and_set',
        'fetch_and_add',
        'compare_and_swap',
        'swap',
      ],
      answer: 2,
      hint: '`compare_and_swap` checks if `*value == expected` and only then sets `*value = new_value`, returning the original value.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'In a monitor, what happens when a process calls `cwait(c)` on condition variable `c`?',
      choices: [
        'It signals all processes waiting on c to wake up',
        'It acquires the monitor lock and enters the critical section',
        'It suspends the calling process on condition c and releases the monitor',
        'It increments a semaphore associated with c',
      ],
      answer: 2,
      hint: '`cwait(c)` blocks the calling process, releasing the monitor so another process can enter; it resumes when `csignal(c)` is called.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'Which of the following is the most common and practical variant of message passing?',
      choices: [
        'Blocking send, blocking receive (rendezvous)',
        'Nonblocking send, blocking receive',
        'Nonblocking send, nonblocking receive',
        'Blocking send, nonblocking receive',
      ],
      answer: 1,
      hint: 'Nonblocking send lets the sender continue immediately after sending; the receiver blocks until a message arrives — this balances efficiency and simplicity.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'In the Readers/Writers problem, how does the writers-priority solution prevent writer starvation?',
      choices: [
        'It allows multiple writers to write simultaneously',
        'It prevents new readers from entering once a writer is waiting',
        'It uses a strong FIFO semaphore only for readers',
        'It gives writers direct access to the data area without synchronization',
      ],
      answer: 1,
      hint: 'When a writer is waiting, `rsem` (or similar) blocks new readers from entering, ensuring the writer gains access as soon as current readers finish.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'Which of the following about spinlocks (mutex locks with busy-waiting) is TRUE?',
      choices: [
        'They are most efficient when locks are held for a long time',
        'They require a context switch each time a process must wait',
        'They avoid context switch overhead and are useful for short critical sections on multiprocessors',
        'They guarantee freedom from starvation',
      ],
      answer: 2,
      hint: 'Spinlocks keep checking in a tight loop, avoiding context-switch overhead — practical when the wait is expected to be very short.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'What is the negative magnitude of a semaphore\'s value when it is negative?',
      choices: [
        'The number of processes in the ready queue',
        'The number of processes currently in the critical section',
        'The number of processes waiting (blocked) on that semaphore',
        'The number of resources still available',
      ],
      answer: 2,
      hint: 'When the semaphore value is negative, its absolute value equals the count of processes blocked on its waiting queue.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'In the Dining Philosophers problem, allowing at most four philosophers to sit at the table at once avoids deadlock because:',
      choices: [
        'Four chopsticks are always available for waiting philosophers',
        'With at most four seated, at least one philosopher can always obtain both chopsticks',
        'It ensures philosophers eat in a fixed round-robin order',
        'It forces philosophers to put down chopsticks after a timeout',
      ],
      answer: 1,
      hint: 'With 5 chopsticks and at most 4 seated philosophers, the pigeonhole principle guarantees at least one philosopher can hold two chopsticks.',
      figure: null,
    },

    // ==================== LIST ====================
    {
      type: 'list',
      question: 'List the six requirements that any mutual exclusion mechanism must satisfy.',
      choices: null,
      answer: [
        'Only one process at a time is allowed into its critical section for the same resource.',
        'A process that halts in its noncritical section must not interfere with other processes.',
        'It must not be possible for a process to be delayed indefinitely (no deadlock or starvation).',
        'When no process is in a critical section, any requesting process must be permitted without delay.',
        'No assumptions are made about relative process speeds or number of processors.',
        'A process remains inside its critical section for a finite time only.',
      ],
      figure: null,
    },
    {
      type: 'list',
      question: 'List the three semaphore operations and briefly describe each.',
      choices: null,
      answer: [
        'Initialize: set the semaphore to a nonnegative integer value.',
        'wait (semWait / decrement): decrement the semaphore; if the result is negative, block the calling process.',
        'signal (semSignal / increment): increment the semaphore; if the result is ≤ 0, unblock one waiting process.',
      ],
      figure: null,
    },
    {
      type: 'list',
      question: 'List four disadvantages of using special machine instructions (e.g., test_and_set) for mutual exclusion.',
      choices: null,
      answer: [
        'Busy-waiting (spinning) wastes processor time.',
        'Starvation is possible because the choice among waiting processes is arbitrary.',
        'Deadlock is possible if the instructions are used incorrectly.',
        'They are generally inaccessible to application programmers directly.',
      ],
      figure: null,
    },
    {
      type: 'list',
      question: 'List the three semaphores used in the correct bounded-buffer producer/consumer solution and their initial values.',
      choices: null,
      answer: [
        'mutex — binary semaphore initialized to 1 (provides mutual exclusion on the buffer).',
        'full — counting semaphore initialized to 0 (counts the number of full buffer slots).',
        'empty — counting semaphore initialized to n (counts the number of empty buffer slots).',
      ],
      figure: null,
    },

    // ==================== DEFINE ====================
    {
      type: 'define',
      question: 'Define a "monitor" in the context of concurrent programming.',
      choices: null,
      answer: 'A monitor is a high-level programming language construct (abstract data type) that encapsulates shared data variables, procedures, and initialization code. It enforces mutual exclusion automatically — only one process may be active inside the monitor at any time. Synchronization between processes inside the monitor is achieved using condition variables with cwait and csignal operations.',
      figure: null,
    },
    {
      type: 'define',
      question: 'Define "indirect addressing" in message passing.',
      choices: null,
      answer: 'Indirect addressing is a message passing scheme in which messages are not sent directly from sender to receiver. Instead, they are sent to a named shared data structure called a mailbox (or queue), from which receivers retrieve them. This decouples the sender and receiver and allows many-to-many communication patterns.',
      figure: null,
    },
    {
      type: 'define',
      question: 'Define "starvation" in the context of concurrent process scheduling.',
      choices: null,
      answer: 'Starvation is a situation in which a runnable process is indefinitely denied access to a resource or the processor, even though there is no deadlock. It can occur when other processes are repeatedly given priority, preventing the starved process from ever proceeding.',
      figure: null,
    },

    // ==================== FILL IN THE BLANK ====================
    {
      type: 'fill',
      question: 'The `________` instruction atomically reads a memory word and sets it to TRUE, returning the original value.',
      choices: null,
      answer: 'test_and_set',
      figure: null,
    },
    {
      type: 'fill',
      question: 'In the semaphore implementation without busy-waiting, the `________` operation places a process on the semaphore\'s waiting queue.',
      choices: null,
      answer: 'block',
      figure: null,
    },
    {
      type: 'fill',
      question: 'A monitor supports synchronization using ________ variables; a process waits on one using `cwait` and resumes on `csignal`.',
      choices: null,
      answer: 'condition',
      figure: null,
    },
    {
      type: 'fill',
      question: 'In the Readers/Writers problem, the semaphore ________ is used to provide mutual exclusion between readers and writers.',
      choices: null,
      answer: 'wsem',
      figure: null,
    },
    {
      type: 'fill',
      question: 'A ________ semaphore uses FIFO ordering to unblock waiting processes, guaranteeing freedom from starvation.',
      choices: null,
      answer: 'strong',
      figure: null,
    },
    {
      type: 'fill',
      question: 'Disabling interrupts enforces mutual exclusion on a ________ system but fails on multiprocessor systems.',
      choices: null,
      answer: 'uniprocessor',
      figure: null,
    },
    {
      type: 'fill',
      question: 'In the Dining Philosophers problem, allowing at most ________ philosophers to sit simultaneously prevents deadlock by guaranteeing one philosopher can always obtain both chopsticks.',
      choices: null,
      answer: 'four',
      figure: null,
    },
    {
      type: 'fill',
      question: 'The `compare_and_swap` instruction sets `*value = new_value` only if `*value` equals ________ .',
      choices: null,
      answer: 'expected',
      figure: null,
    },
  ];

  const LECTURE = 5;
  const SOURCE = 'student';
  window.ALL_QUESTIONS.push(...lec05_student.map(q => ({ ...q, lecture: LECTURE, source: SOURCE })));
})();
