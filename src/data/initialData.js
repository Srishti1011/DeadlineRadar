import { addDays, getTodayISO } from '../utils/dateUtils';

export const INITIAL_SUBJECTS = [
  {
    id: 'sub-dsa',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    faculty: 'Dr. Arvind Ramanathan',
    color: '#8B5CF6', // Violet
    description: 'Advanced trees, graphs, dynamic programming, and complexity bounds.'
  },
  {
    id: 'sub-os',
    name: 'Operating Systems',
    code: 'CS204',
    faculty: 'Prof. Elena Rostova',
    color: '#3B82F6', // Blue
    description: 'Process scheduling, virtual memory, threads, synchronization, and POSIX.'
  },
  {
    id: 'sub-oop',
    name: 'Object Oriented Programming',
    code: 'CS203',
    faculty: 'Dr. Marcus Vance',
    color: '#10B981', // Emerald / Teal
    description: 'Design patterns, Java & C++ concurrency, SOLID principles, and architecture.'
  },
  {
    id: 'sub-nla',
    name: 'Numerical Linear Algebra',
    code: 'MA210',
    faculty: 'Prof. Sunita Kulkarni',
    color: '#F59E0B', // Amber
    description: 'SVD decomposition, matrix factorization, QR algorithm, and least squares.'
  },
  {
    id: 'sub-aiml',
    name: 'Artificial Intelligence and Machine Learning',
    code: 'CS305',
    faculty: 'Dr. Sarah Chen',
    color: '#F43F5E', // Coral / Rose
    description: 'Neural networks, optimization, gradient descent, reinforcement learning, and transformers.'
  }
];

export const generateInitialTasks = () => {
  const today = getTodayISO();

  return [
    {
      id: 'task-1',
      title: 'Red-Black Tree Self-Balancing Implementation',
      description: 'Implement insertion, deletion, and rotation routines in C++ with test cases for left/right rotation balancing invariant proofs.',
      subjectId: 'sub-dsa',
      subjectName: 'Data Structures and Algorithms',
      category: 'Assignment',
      dueDate: today,
      dueTime: '23:59',
      priority: 'high',
      estimatedHours: 4.5,
      notes: 'Ensure valgrind reports no memory leaks on 10,000 randomized test insertions.',
      completed: false,
      createdAt: addDays(today, -3)
    },
    {
      id: 'task-2',
      title: 'POSIX Thread Synchronization & Mutex Deadlock Benchmark',
      description: 'Solve the Dining Philosophers dilemma without livelock using pthread semaphores and compare throughput metrics.',
      subjectId: 'sub-os',
      subjectName: 'Operating Systems',
      category: 'Lab Evaluation',
      dueDate: today,
      dueTime: '17:00',
      priority: 'medium',
      estimatedHours: 3.0,
      notes: 'Lab viva will test starvation scenarios under heavy contention.',
      completed: false,
      createdAt: addDays(today, -2)
    },
    {
      id: 'task-3',
      title: 'Eigenvalues & SVD Low-Rank Image Compression',
      description: 'Compute singular value decomposition of 2048x2048 monochrome matrices and determine rank-k approximation fidelity.',
      subjectId: 'sub-nla',
      subjectName: 'Numerical Linear Algebra',
      category: 'Assignment',
      dueDate: addDays(today, -1), // Overdue to demonstrate alert & overdue filters
      dueTime: '12:00',
      priority: 'high',
      estimatedHours: 5.0,
      notes: 'Late submission window open with -5% penalty per 12 hours.',
      completed: false,
      createdAt: addDays(today, -5)
    },
    {
      id: 'task-4',
      title: 'Backpropagation & Gradient Descent from Scratch in NumPy',
      description: 'Build a 3-layer MLP network without PyTorch/TensorFlow. Train on MNIST and achieve >96% validation accuracy.',
      subjectId: 'sub-aiml',
      subjectName: 'Artificial Intelligence and Machine Learning',
      category: 'Project',
      dueDate: addDays(today, 2),
      dueTime: '22:00',
      priority: 'high',
      estimatedHours: 6.0,
      notes: 'Save model loss curves and plot confusion matrix for the submission PDF.',
      completed: false,
      createdAt: addDays(today, -4)
    },
    {
      id: 'task-5',
      title: 'Design Patterns & SOLID Principles In-Class Quiz',
      description: 'Multiple choice and short coding problems on Abstract Factory, Strategy, and Observer pattern refactoring.',
      subjectId: 'sub-oop',
      subjectName: 'Object Oriented Programming',
      category: 'Quiz',
      dueDate: addDays(today, 1), // Tomorrow
      dueTime: '10:30',
      priority: 'medium',
      estimatedHours: 2.0,
      notes: 'Covers Gang of Four chapters 1-4. 30 questions in 45 minutes.',
      completed: false,
      createdAt: addDays(today, -1)
    },
    {
      id: 'task-6',
      title: 'Memory Management & Page Replacement Algorithms Mid-Term',
      description: 'In-person comprehensive evaluation covering virtual address translation, TLB hits, LRU, Clock, and Working Set algorithms.',
      subjectId: 'sub-os',
      subjectName: 'Operating Systems',
      category: 'Examination',
      dueDate: addDays(today, 3),
      dueTime: '09:00',
      priority: 'high',
      estimatedHours: 8.0,
      notes: 'Closed book exam in Hall C. Scientific calculators allowed.',
      completed: false,
      createdAt: addDays(today, -6)
    },
    {
      id: 'task-7',
      title: 'Transformer Self-Attention Mechanism Paper Presentation',
      description: 'Deliver an 8-minute slide deck explaining multi-head attention equations and positional encodings in Vaswani et al.',
      subjectId: 'sub-aiml',
      subjectName: 'Artificial Intelligence and Machine Learning',
      category: 'Presentation',
      dueDate: addDays(today, 4),
      dueTime: '14:00',
      priority: 'medium',
      estimatedHours: 3.5,
      notes: 'Rehearse with peer reviewer beforehand to ensure under 8-minute limit.',
      completed: false,
      createdAt: addDays(today, -3)
    },
    {
      id: 'task-8',
      title: 'Shortest Path Graph Algorithms (Dijkstra vs A*) Analysis',
      description: 'Benchmarking execution times with priority queue implementations across sparse and dense generated graphs.',
      subjectId: 'sub-dsa',
      subjectName: 'Data Structures and Algorithms',
      category: 'Assignment',
      dueDate: addDays(today, 5),
      dueTime: '23:59',
      priority: 'low',
      estimatedHours: 2.5,
      notes: 'Submit Jupyter notebook alongside Python script.',
      completed: false,
      createdAt: addDays(today, -1)
    },
    {
      id: 'task-9',
      title: 'Householder Reflectors & QR Factorization Proofs',
      description: 'Rigorous derivation of orthogonality proofs and backward stability bounds for QR factorization.',
      subjectId: 'sub-nla',
      subjectName: 'Numerical Linear Algebra',
      category: 'Assignment',
      dueDate: addDays(today, -2),
      dueTime: '18:00',
      priority: 'medium',
      estimatedHours: 3.0,
      notes: 'Checked and graded by Teaching Assistant.',
      completed: true,
      completedAt: addDays(today, -2),
      createdAt: addDays(today, -7)
    },
    {
      id: 'task-10',
      title: 'Factory & Singleton Concurrency Safety Quiz',
      description: 'Double-checked locking evaluation in multithreaded Java applications.',
      subjectId: 'sub-oop',
      subjectName: 'Object Oriented Programming',
      category: 'Quiz',
      dueDate: addDays(today, -4),
      dueTime: '11:00',
      priority: 'low',
      estimatedHours: 1.5,
      notes: 'Scored 19/20.',
      completed: true,
      completedAt: addDays(today, -4),
      createdAt: addDays(today, -8)
    }
  ];
};

export const INITIAL_SETTINGS = {
  displayName: 'Srishti',
  avatarInitials: 'SR',
  dateFormat: 'MMM DD, YYYY',
  theme: 'light',
  notifications: {
    deadlineAlerts: true,
    soundEnabled: true,
    reminderHoursBefore: 24,
    dailyDigest: true
  }
};
