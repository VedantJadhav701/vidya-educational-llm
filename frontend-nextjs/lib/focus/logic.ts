import { Question, Difficulty } from './types';

const LOGIC_BANK: Omit<Question, 'id'>[] = [
  {
    type: 'logic',
    category: 'Ordering',
    question: 'A is taller than B. B is taller than C. Who is the shortest?',
    options: ['C', 'A', 'B', 'Cannot be determined'],
    correctAnswer: 'C',
    difficulty: 'easy',
  },
  {
    type: 'logic',
    category: 'Odd-One-Out',
    question: 'Which word is the odd one out?',
    options: ['Circle', 'Triangle', 'Cube', 'Square'],
    correctAnswer: 'Cube',
    difficulty: 'easy', // Cube is 3D, others are 2D
  },
  {
    type: 'logic',
    category: 'Deduction',
    question: 'If all A are B, and all B are C, then all A are...?',
    options: ['C', 'Not C', 'D', 'B only'],
    correctAnswer: 'C',
    difficulty: 'easy',
  },
  {
    type: 'logic',
    category: 'Number Logic',
    question: 'If 3 cats catch 3 mice in 3 minutes, how many cats catch 100 mice in 100 minutes?',
    options: ['3', '100', '300', '33'],
    correctAnswer: '3',
    difficulty: 'medium',
  },
  {
    type: 'logic',
    category: 'Ordering',
    question: 'X arrived before Y. Z arrived after Y. Who arrived first?',
    options: ['X', 'Y', 'Z', 'None'],
    correctAnswer: 'X',
    difficulty: 'easy',
  },
  {
    type: 'logic',
    category: 'Conditional Logic',
    question: 'If it rains, the ground gets wet. The ground is wet. Is it definitely raining?',
    options: ['No, other causes are possible', 'Yes, definitely', 'Impossible to know', 'Only at night'],
    correctAnswer: 'No, other causes are possible',
    difficulty: 'medium',
  },
  {
    type: 'logic',
    category: 'Number Logic',
    question: 'A clock strikes 6 times in 5 seconds. How many seconds will it take to strike 12 times?',
    options: ['11 seconds', '10 seconds', '12 seconds', '6 seconds'],
    correctAnswer: '11 seconds', // 5 intervals take 5 seconds (1s each), so 11 intervals take 11 seconds
    difficulty: 'hard',
  },
  {
    type: 'logic',
    category: 'Odd-One-Out',
    question: 'Which number is the odd one out: 2, 3, 5, 7, 9, 11?',
    options: ['9', '2', '5', '11'],
    correctAnswer: '9', // 9 is composite, others are prime
    difficulty: 'medium',
  },
];

export function getLogicQuestion(difficulty: Difficulty): Question {
  const filtered = LOGIC_BANK.filter((q) => q.difficulty === difficulty || difficulty === 'hard');
  const selected = filtered[Math.floor(Math.random() * filtered.length)] || LOGIC_BANK[0];

  return {
    ...selected,
    id: `logic-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  };
}
