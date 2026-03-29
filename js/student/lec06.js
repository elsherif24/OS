// ===== LECTURE 06: Deadlock and Starvation — STUDENT =====
// Student-added questions only. Testbank questions are in (js/testbank/lec06.js)
// See GUIDE.md for how to add/edit questions.

if (typeof window.ALL_QUESTIONS === 'undefined') {
  window.ALL_QUESTIONS = [];
}

(function () {
  const lec06_student = [
    // ==================== TRUE / FALSE ====================
    {
      type: 'tf',
      question: 'A safe state guarantees that all processes can eventually complete, even if some must wait.',
      choices: ['True', 'False'],
      answer: 0,
      hint: 'A safe state means there exists at least one sequence in which every process can obtain all its needed resources and finish.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'An unsafe state always leads to deadlock.',
      choices: ['True', 'False'],
      answer: 1,
      hint: 'An unsafe state means no guaranteed safe sequence exists, but it does not mean deadlock is inevitable — it just cannot be guaranteed that it won\'t happen.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'In the deadlock detection algorithm, the temporary vector W is initialized to the current Available resources vector.',
      choices: ['True', 'False'],
      answer: 0,
      hint: 'W starts as a copy of the Available vector and grows as processes are found to be able to finish and release their allocations.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'Running the deadlock detection algorithm on every resource request is the least costly option.',
      choices: ['True', 'False'],
      answer: 1,
      hint: 'Running detection on every request detects deadlocks earliest but carries the highest overhead; periodic checking is cheaper.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'Aborting all deadlocked processes at once is the simplest recovery strategy but also the most costly.',
      choices: ['True', 'False'],
      answer: 0,
      hint: 'Aborting all deadlocked processes requires no iteration and is simple to implement, but loses all partially completed work.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'Deadlock avoidance requires that the number of available resources be fixed and known in advance.',
      choices: ['True', 'False'],
      answer: 0,
      hint: 'Avoidance algorithms like the Banker\'s Algorithm depend on knowing fixed resource totals; dynamic changes invalidate the safety calculations.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'In deadlock avoidance, processes are allowed to have synchronization dependencies on each other.',
      choices: ['True', 'False'],
      answer: 1,
      hint: 'Avoidance requires processes to be independent — synchronization dependencies are not allowed because they complicate the safe-state calculation.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'In the Dining Philosophers problem, a monitor-based solution can prevent both deadlock and starvation.',
      choices: ['True', 'False'],
      answer: 0,
      hint: 'A carefully designed monitor can coordinate philosopher access to forks so that no circular wait forms and no philosopher is indefinitely denied access.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'A cycle in a resource-allocation graph always implies deadlock, regardless of the number of resource instances.',
      choices: ['True', 'False'],
      answer: 1,
      hint: 'A cycle implies deadlock only for single-instance resources. With multiple instances of a resource, a cycle is a necessary but not sufficient condition for deadlock.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'One way to prevent the hold-and-wait condition is to require a process to release all held resources before it can request additional resources.',
      choices: ['True', 'False'],
      answer: 0,
      hint: 'Releasing all held resources before requesting new ones is one of the two standard methods to eliminate hold-and-wait, though it can lead to low utilization and starvation.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'Deadlock involving consumable resources is always caused by hardware faults.',
      choices: ['True', 'False'],
      answer: 1,
      hint: 'Consumable-resource deadlock (e.g., two processes each blocking on Receive waiting for the other) is a design error, not a hardware fault.',
      figure: null,
    },
    {
      type: 'tf',
      question: 'To avoid starvation of victim processes during preemption-based recovery, the number of times a process has been rolled back should be included in the victim selection cost metric.',
      choices: ['True', 'False'],
      answer: 0,
      hint: 'Including rollback count prevents the same process from being chosen repeatedly as a victim, which would cause starvation.',
      figure: null,
    },

    // ==================== MULTIPLE CHOICE ====================
    {
      type: 'mcq',
      question: 'Which of the following is NOT one of the four necessary conditions for deadlock?',
      choices: [
        'Mutual Exclusion',
        'Hold-and-Wait',
        'Starvation',
        'Circular Wait',
      ],
      answer: 2,
      hint: 'The four necessary conditions are Mutual Exclusion, Hold-and-Wait, No Preemption, and Circular Wait. Starvation is a related but separate concept.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'In the Banker\'s Algorithm, a resource request is granted only if:',
      choices: [
        'The requesting process has the highest priority in the system.',
        'The resulting allocation state is safe.',
        'No other process is currently holding any resources.',
        'The process has declared all its resources in a single request.',
      ],
      answer: 1,
      hint: 'The Banker\'s Algorithm checks whether fulfilling the request leaves the system in a safe state before granting it.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'Which of the following is a restriction of deadlock avoidance that does NOT apply to deadlock detection?',
      choices: [
        'Processes must eventually release all held resources.',
        'Maximum resource requirements must be stated in advance.',
        'The system must be able to recover from detected deadlocks.',
        'Resources must have at least one instance each.',
      ],
      answer: 1,
      hint: 'Deadlock avoidance requires advance knowledge of maximum demands; detection and recovery imposes no such restriction.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'In the deadlock detection algorithm, what action is taken when an unmarked process i is found whose request row Q[i] ≤ W?',
      choices: [
        'Process i is immediately terminated.',
        'Process i is marked, and its allocated resources are added to W.',
        'W is reset to the original Available vector.',
        'Process i is preempted and its resources given to another process.',
      ],
      answer: 1,
      hint: 'The algorithm simulates process i completing: it marks i as finishable and "releases" its allocations by adding A[i] to W, then looks for another process.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'Which recovery strategy invokes the detection algorithm after each individual process termination?',
      choices: [
        'Abort all deadlocked processes at once.',
        'Roll back all processes to their most recent checkpoint simultaneously.',
        'Abort processes one at a time until the deadlock is resolved.',
        'Preempt all resources from all deadlocked processes at once.',
      ],
      answer: 2,
      hint: 'One-by-one abortion re-runs detection after each termination to check whether deadlock has been broken, minimising unnecessary abortions.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'For which resource class is prevention by preemption (swapping out processes) most commonly applied?',
      choices: [
        'Swappable space',
        'Internal resources (I/O channels)',
        'Process resources (tape drives, files)',
        'Main memory',
      ],
      answer: 3,
      hint: 'Main memory deadlocks are typically resolved by preempting (swapping out) processes to free up memory.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'Which of the following describes the "process initiation denial" approach to deadlock avoidance?',
      choices: [
        'A process is not started if its maximum demand plus current system demands could lead to an unsafe state.',
        'A running process is blocked whenever it requests a resource that is currently unavailable.',
        'Resources are preempted from lower-priority processes when a higher-priority process requests them.',
        'All resource requests are queued and served in FIFO order.',
      ],
      answer: 0,
      hint: 'Process initiation denial refuses to create a new process if combining its maximum needs with existing demands could result in an unavoidable unsafe state.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'In the Dining Philosophers problem, the asymmetric solution (odd philosophers pick up the left fork first, even pick up the right fork first) prevents deadlock because:',
      choices: [
        'It ensures philosophers never pick up both forks simultaneously.',
        'It breaks the symmetry that would otherwise create a circular wait.',
        'It limits the total number of philosophers at the table.',
        'It introduces a waiter who grants permission to pick up forks.',
      ],
      answer: 1,
      hint: 'Asymmetric fork pickup breaks the potential circular chain: at least one adjacent pair of philosophers will contend for the same fork in opposing directions, preventing a cycle.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'Which of the following is the MOST conservative (restrictive) approach to dealing with deadlock?',
      choices: [
        'Deadlock detection and recovery',
        'Deadlock avoidance',
        'Deadlock prevention',
        'Ignoring deadlock (ostrich algorithm)',
      ],
      answer: 2,
      hint: 'Prevention eliminates one or more necessary conditions system-wide, restricting what processes can do; avoidance is less restrictive; detection is the most permissive.',
      figure: null,
    },
    {
      type: 'mcq',
      question: 'A deadlock involving consumable resources can occur when:',
      choices: [
        'Both processes simultaneously request the same disk file.',
        'Two processes each perform a blocking Receive waiting for a message from the other.',
        'Two processes each hold a reusable resource and neither will release it.',
        'A single process allocates more memory than available.',
      ],
      answer: 1,
      hint: 'If P1 does Receive(P2) and P2 does Receive(P1) before either sends, both block forever with no one to produce the awaited message.',
      figure: null,
    },

    // ==================== LIST ====================
    {
      type: 'list',
      question: 'List the four necessary conditions that must ALL hold simultaneously for deadlock to occur.',
      choices: null,
      answer: [
        'Mutual Exclusion — only one process may use a resource at a time.',
        'Hold-and-Wait — a process may hold allocated resources while waiting for additional resources.',
        'No Preemption — no resource can be forcibly removed from a process holding it.',
        'Circular Wait — a closed chain of processes exists where each holds a resource needed by the next.',
      ],
      figure: null,
    },
    {
      type: 'list',
      question: 'List the four recovery strategies available once a deadlock has been detected.',
      choices: null,
      answer: [
        'Abort all deadlocked processes.',
        'Roll back each deadlocked process to a checkpoint and restart.',
        'Abort processes one-by-one until the deadlock cycle is broken (re-run detection after each abort).',
        'Preempt resources from some processes and reassign them until deadlock is resolved.',
      ],
      figure: null,
    },
    {
      type: 'list',
      question: 'List four criteria used to select a victim process when aborting or preempting resources during deadlock recovery.',
      choices: null,
      answer: [
        'Process priority.',
        'How long the process has computed and how much time remains until completion.',
        'Number and type of resources the process currently holds.',
        'Whether it is an interactive (foreground) or batch (background) process.',
      ],
      figure: null,
    },
    {
      type: 'list',
      question: 'List the four restrictions that deadlock avoidance imposes on the system.',
      choices: null,
      answer: [
        'Maximum resource requirements must be stated by each process in advance.',
        'Processes must be independent — no synchronization dependencies between them.',
        'The number of resources must be fixed and known.',
        'Processes must not exit while holding resources.',
      ],
      figure: null,
    },
    {
      type: 'list',
      question: 'List the steps of the deadlock detection algorithm.',
      choices: null,
      answer: [
        '1. Initialize temporary vector W = Available.',
        '2. (Optional) Mark processes that currently have no allocated resources.',
        '3. Find an unmarked process i whose request row Q[i] ≤ W (component-wise).',
        '4. If found, mark process i as able to finish and set W = W + A[i]; repeat from step 3.',
        '5. If no such process is found, terminate. Any unmarked processes are deadlocked.',
      ],
      figure: null,
    },
    {
      type: 'list',
      question: 'List the three high-level approaches used in the integrated deadlock strategy and give one example resource class for each.',
      choices: null,
      answer: [
        'Prevention — used for internal resources such as I/O channels (resource ordering prevents circular wait).',
        'Avoidance — used for process resources such as tape drives and files (processes declare maximum needs).',
        'Prevention by preemption — used for main memory (swap out processes to free memory).',
      ],
      figure: null,
    },

    // ==================== DEFINE ====================
    {
      type: 'define',
      question: 'Define a "safe state" in the context of deadlock avoidance.',
      choices: null,
      answer: 'A safe state is one in which there exists at least one safe sequence ⟨P1, P2, …, Pn⟩ of all processes such that each process Pi can obtain all its remaining resource needs from the currently available resources plus the resources held by all processes Pj (j < i). In a safe state, every process can eventually complete without deadlock.',
      figure: null,
    },
    {
      type: 'define',
      question: 'Define "deadlock prevention" and contrast it with "deadlock avoidance".',
      choices: null,
      answer: 'Deadlock prevention designs the system so that at least one of the four necessary conditions (mutual exclusion, hold-and-wait, no preemption, circular wait) can never hold, thus making deadlock structurally impossible. Deadlock avoidance, by contrast, allows all four conditions to potentially exist but makes runtime allocation decisions — using knowledge of maximum process demands — that ensure the system never enters an unsafe state.',
      figure: null,
    },
    {
      type: 'define',
      question: 'Define "consumable resource" and give two examples.',
      choices: null,
      answer: 'A consumable resource is one that is created (produced) by one process and destroyed (consumed) by another; it does not persist after use. Examples include: interrupts and signals (generated by hardware/software events and consumed once handled), and messages (sent by one process and consumed when received by another).',
      figure: null,
    },

    // ==================== FILL IN THE BLANK ====================
    {
      type: 'fill',
      question: 'A state is ________ if there exists at least one sequence in which every process can obtain all needed resources and finish without deadlock.',
      choices: null,
      answer: 'safe',
      figure: null,
    },
    {
      type: 'fill',
      question: 'In the deadlock detection algorithm, at termination any ________ processes are identified as deadlocked.',
      choices: null,
      answer: 'unmarked',
      figure: null,
    },
    {
      type: 'fill',
      question: 'The __________ method of deadlock prevention prevents circular wait by defining a total ordering of resource types and requiring processes to request resources in increasing order.',
      choices: null,
      answer: 'direct',
      figure: null,
    },
    {
      type: 'fill',
      question: 'In deadlock avoidance, the ________ denial approach refuses to start a new process if its maximum demand combined with current system demands could lead to an unsafe state.',
      choices: null,
      answer: 'process initiation',
      figure: null,
    },
    {
      type: 'fill',
      question: 'In the resource-allocation graph, an edge from a process Pi to a resource Rj is called a ________ edge.',
      choices: null,
      answer: 'request',
      figure: null,
    },
    {
      type: 'fill',
      question: 'In the resource-allocation graph, an edge from a resource Rj to a process Pi is called an ________ edge.',
      choices: null,
      answer: 'assignment',
      figure: null,
    },
    {
      type: 'fill',
      question: 'To avoid repeated selection of the same victim during preemption-based recovery, the ________ of rollbacks should be factored into the cost metric.',
      choices: null,
      answer: 'number',
      figure: null,
    },
    {
      type: 'fill',
      question: 'Prevention of the ________ condition can be achieved either by requiring all resources to be requested at once, or by requiring all held resources to be released before requesting new ones.',
      choices: null,
      answer: 'hold-and-wait',
      figure: null,
    },
    {
      type: 'fill',
      question: 'For internal resources such as I/O channels, the integrated deadlock strategy recommends using ________ via resource ordering.',
      choices: null,
      answer: 'prevention',
      figure: null,
    },
    {
      type: 'fill',
      question: 'Deadlock involving consumable resources is typically the result of a ________ error in the program.',
      choices: null,
      answer: 'design',
      figure: null,
    },
  ];

  const LECTURE = 6;
  const SOURCE = 'student';
  window.ALL_QUESTIONS.push(...lec06_student.map(q => ({ ...q, lecture: LECTURE, source: SOURCE })));
})();
