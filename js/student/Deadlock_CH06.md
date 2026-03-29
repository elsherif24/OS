# Concurrency — Deadlock and Starvation

---

# Deadlock

- Definition: The permanent blocking of a set of processes that either compete for system resources or communicate with each other.
- A set of processes is deadlocked when each process in the set is blocked awaiting an event that can only be triggered by another blocked process in the set.
- Permanent because none of the events is ever triggered.
- There is no efficient solution in the general case.

# Resource Categories

- Reusable resources
  - Can be safely used by only one process at a time and are not depleted by that use.
  - Examples: processors, I/O channels, main and secondary memory, devices, and data structures such as files, databases, and semaphores.
  - Processes obtain resources and later release them for reuse by other processes. Deadlock can occur if each process holds one resource and requests another.

- Consumable resources
  - Created (produced) and destroyed (consumed) by processes.
  - Examples: interrupts, signals, messages, and information in I/O buffers.
  - Deadlock may occur if a blocking `Receive` is used (e.g., two processes each do `Receive(other)` then `Send(other)`).

# Examples

- Reusable resources example (two processes): Two processes P and Q competing for exclusive access to disk file D and tape drive T. Deadlock can occur for certain interleavings of requests and locks.

- Memory request example: Space available = 200 KB.
  - P1: Request 80 KB; later Request 60 KB.
  - P2: Request 70 KB; later Request 80 KB.
  - Deadlock occurs if both processes progress to their second request.

- Consumable-resource example (message passing): If both processes block on `Receive` waiting for the other, deadlock occurs — this is a design error.

# Resource-Allocation Graphs

- Deadlocks can be described using a directed graph called a Resource-Allocation Graph.
- Vertices V are partitioned into processes P = {P1, P2, …, Pn} and resources R = {R1, R2, …, Rm}.
- Request edge: Pi → Rj (process requesting a resource type).
- Assignment edge: Rj → Pi (resource instance assigned to a process).
- Convention: process = circle, resource = square; a dot represents each instance of a resource.
- If the graph contains no cycles → no deadlock.
- If the graph contains a cycle → a deadlock may exist (for single-instance resources a cycle implies deadlock). Example cycles illustrate when processes are waiting in a circular chain.

# Conditions for Deadlock

All four must hold for deadlock to occur:

1. Mutual Exclusion
   - Only one process may use a resource at a time.
2. Hold-and-Wait
   - A process may hold allocated resources while awaiting assignment of other resources.
3. No Pre-emption
   - No resource can be forcibly removed from a process holding it.
4. Circular Wait
   - A closed chain of processes exists where each process holds at least one resource needed by the next process in the chain.

- The first three conditions are necessary but not sufficient; all four together characterize deadlock.

# Approaches to Address Deadlock

Three common approaches:

- Deadlock Prevention — design the system so that deadlock is impossible (disallow one of the necessary conditions or prevent circular wait).
- Deadlock Avoidance — do not grant a resource request if that allocation might lead to deadlock (requires advance knowledge of maximum demands).
- Deadlock Detection and Recovery — allow allocations, periodically check for deadlock, and take corrective action when detected.

Many systems (including UNIX historically) simply ignore deadlocks or rely on manual intervention.

# Deadlock Prevention (methods and trade-offs)

Two high-level methods:

- Indirect: Prevent the occurrence of one of the three necessary conditions (mutual exclusion, hold-and-wait, no preemption).
- Direct: Prevent circular wait (for example, by enforcing an ordering of resource types).

Details per condition:

- Mutual Exclusion
  - Not all resources can avoid mutual exclusion (e.g., write access to a file). For read-only sharable resources, mutual exclusion may be relaxed.

- Hold-and-Wait
  - Prevent by requiring processes to request all needed resources at once (may delay process start and waste resources), or require processes to release all held resources before requesting new ones (leads to low utilization and possible starvation).

- No Preemption
  - Allow preemption: if a process holding resources is denied a further request, it must release its resources and try again. This can be inefficient and is only feasible for resources whose state can be saved/restored (e.g., CPU state).

- Circular Wait
  - Impose a total ordering of resource types and require processes to request resources in increasing order. This prevents circular wait but can be inefficient and deny resources unnecessarily.

# Deadlock Avoidance

- Allow the necessary conditions but allocate resources only when doing so leaves the system in a safe state.
- Requires knowledge (or declaration) of each process's maximum resource needs.
- Two approaches:
  - Process initiation denial: Do not start a process if its maximum demand, combined with current demands, could lead to an unsafe state.
  - Resource allocation denial (Banker’s algorithm): Grant a request only if the resulting state is safe.

- Safe state definition: There exists an ordering of all processes <P1, P2, …, Pn> such that each Pi can obtain its remaining needs from the currently available resources plus resources held by Pj for j < i. If such a sequence exists, the state is safe; otherwise, it is unsafe.

- Restrictions of avoidance:
  - Maximum resource requirements must be stated in advance.
  - Processes must be independent (no synchronization requirements between them).
  - The number of resources must be fixed and known.
  - Processes must not exit while holding resources.

- Advantages: avoids preemption and rollback; less restrictive than pure prevention.

# Banker’s Algorithm / Determination of Safe State

- State representation: allocation matrix A, maximum demand matrix C (or similar), available vector V.
- To determine if a state is safe: find a process whose remaining need can be satisfied by `Available`. Mark it as finishable, add its allocated resources to `Available`, and repeat. If all processes can be marked, the state is safe.

# Deadlock Detection

- Detection options: run the detection algorithm on every resource request (early detection but high cost) or periodically (lower overhead but slower response).
- Detection algorithm (matrix-based summary):
  1. Use allocation matrix A and request matrix Q (Qij = amount of resource j requested by process i) and Available vector V.
  2. Mark processes with no allocated resources as not deadlocked (optional starting heuristic from slides).
  3. Initialize temporary vector W = Available.
  4. Find an unmarked process i whose request Q[i] ≤ W (component-wise). If none found, terminate.
  5. If found, mark process i as able to finish, set W = W + A[i], and repeat step 4.
  6. At termination, any unmarked processes are deadlocked.

- The algorithm identifies which processes are part of a deadlock and which are not.

# Detection Usage and Trade-offs

- Invocation frequency depends on how likely deadlocks are and the cost of detection vs. recovery.
- Running the detection at every request is costly but finds deadlocks early. Periodic checks reduce overhead.

# Recovery Strategies (once deadlock detected)

Options:

1. Abort all deadlocked processes (simple but high cost).
2. Roll back each deadlocked process to a previously defined checkpoint and restart.
3. Abort processes one-by-one until the deadlock is resolved (invoke detection after each abort).
4. Preempt resources from some processes and reassign them until the deadlock is resolved.

Selection criteria for victim choice (when aborting or preempting):

- Process priority.
- How long the process has computed and how much more to completion.
- Resources the process has used.
- Resources the process still needs to complete.
- How many processes would need to be terminated.
- Whether the process is interactive or batch.

Preemption issues:

- Which resources to preempt and from which processes?
- How to restore a preempted process (total rollback vs. partial rollback to a checkpoint)?
- Avoid starvation of victims by limiting how often a process can be chosen as a victim (include number of rollbacks in cost metric).

# Integrated Deadlock Strategy

- Use different strategies for different resource classes; combine prevention, avoidance, and detection as appropriate.
- Suggested resource classes and strategies:
  - Swappable space: prevention by allocating all needed swap space at once (if maximum known); avoidance possible.
  - Process resources (tape drives, files): avoidance often effective because processes can declare needs; prevention by ordering also possible.
  - Main memory: prevention by preemption (swap out processes to free memory) is often appropriate.
  - Internal resources (I/O channels): prevention by resource ordering.

# Dining Philosophers Problem (summary)

- Problem: philosophers sitting around a table, each needs two forks (shared resources) to eat. No two philosophers can use the same fork simultaneously (mutual exclusion). Aim: avoid deadlock and starvation.
- Common solutions illustrated in slides include:
  - Simple resource ordering or asymmetric pickup (e.g., odd philosophers pick up left fork first, even pick up right first).
  - Allowing at most four philosophers to try to pick up forks at once (or introducing a waiter).
  - Using a monitor to control access (ensures no deadlock and can avoid starvation).

# Summary / Practical Notes

- Prevention strategies are conservative and restrict concurrency.
- Avoidance requires advance knowledge and reduces concurrency less than prevention.
- Detection and recovery allow maximum concurrency but require potentially expensive recovery actions.
- In practice, systems often use mixed strategies and choose per-resource-class policies.
