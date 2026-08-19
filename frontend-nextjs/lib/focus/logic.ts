import { Question, Difficulty } from './types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const STATIC_LOGIC_BANK: Omit<Question, 'id'>[] = [
  { type: 'logic', category: 'Ordering', question: 'A is taller than B. B is taller than C. Who is the shortest?', options: ['C', 'A', 'B', 'Cannot be determined'], correctAnswer: 'C', difficulty: 'easy' },
  { type: 'logic', category: 'Odd-One-Out', question: 'Which word is the odd one out?', options: ['Circle', 'Triangle', 'Cube', 'Square'], correctAnswer: 'Cube', difficulty: 'easy' },
  { type: 'logic', category: 'Deduction', question: 'If all A are B, and all B are C, then all A are...?', options: ['C', 'Not C', 'D', 'B only'], correctAnswer: 'C', difficulty: 'easy' },
  { type: 'logic', category: 'Number Logic', question: 'If 3 cats catch 3 mice in 3 minutes, how many cats catch 100 mice in 100 minutes?', options: ['3', '100', '300', '33'], correctAnswer: '3', difficulty: 'medium' },
  { type: 'logic', category: 'Ordering', question: 'X arrived before Y. Z arrived after Y. Who arrived first?', options: ['X', 'Y', 'Z', 'None'], correctAnswer: 'X', difficulty: 'easy' },
  { type: 'logic', category: 'Conditional Logic', question: 'If it rains, the ground gets wet. The ground is wet. Is it definitely raining?', options: ['No, other causes are possible', 'Yes, definitely', 'Impossible to know', 'Only at night'], correctAnswer: 'No, other causes are possible', difficulty: 'medium' },
  { type: 'logic', category: 'Number Logic', question: 'A clock strikes 6 times in 5 seconds. How many seconds will it take to strike 12 times?', options: ['11 seconds', '10 seconds', '12 seconds', '6 seconds'], correctAnswer: '11 seconds', difficulty: 'hard' },
  { type: 'logic', category: 'Odd-One-Out', question: 'Which number is the odd one out: 2, 3, 5, 7, 9, 11?', options: ['9', '2', '5', '11'], correctAnswer: '9', difficulty: 'medium' },
  { type: 'logic', category: 'Deduction', question: 'Some mammals can fly (e.g. bats). All bats are nocturnal. Are all mammals nocturnal?', options: ['No', 'Yes', 'Only bats', 'Cannot be determined'], correctAnswer: 'No', difficulty: 'easy' },
  { type: 'logic', category: 'Ordering', question: 'P is older than Q. R is younger than Q. S is older than P. Who is the oldest?', options: ['S', 'P', 'Q', 'R'], correctAnswer: 'S', difficulty: 'medium' },
  { type: 'logic', category: 'Pattern Logic', question: 'If RED is coded as 18-5-4, how is CAB coded?', options: ['3-1-2', '1-2-3', '3-2-1', '2-1-3'], correctAnswer: '3-1-2', difficulty: 'easy' },
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function generateProceduralLogic(difficulty: Difficulty): Omit<Question, 'id'> {
  const type = getRandomInt(1, 4);

  if (type === 1) { // Direction logic
    const dirs = ['North', 'East', 'South', 'West'];
    const startIdx = getRandomInt(0, 3);
    const turns = ['right', 'left'];
    const turn = turns[getRandomInt(0, 1)];
    let finalIdx = turn === 'right' ? (startIdx + 1) % 4 : (startIdx + 3) % 4;

    return {
      type: 'logic',
      category: 'Directional Logic',
      question: `If you are facing ${dirs[startIdx]} and turn 90° to your ${turn}, which direction are you facing?`,
      options: [dirs[finalIdx], dirs[(finalIdx + 1) % 4], dirs[(finalIdx + 2) % 4], dirs[(finalIdx + 3) % 4]].sort(() => Math.random() - 0.5),
      correctAnswer: dirs[finalIdx],
      difficulty,
    };
  } else if (type === 2) { // Calendar day math
    const startDayIdx = getRandomInt(0, 6);
    const daysAhead = getRandomInt(2, 6) * 7 + getRandomInt(1, 6);
    const targetIdx = (startDayIdx + daysAhead) % 7;

    return {
      type: 'logic',
      category: 'Calendar Logic',
      question: `If today is ${DAYS[startDayIdx]}, what day of the week will it be in ${daysAhead} days?`,
      options: [DAYS[targetIdx], DAYS[(targetIdx + 1) % 7], DAYS[(targetIdx + 2) % 7], DAYS[(targetIdx + 5) % 7]].sort(() => Math.random() - 0.5),
      correctAnswer: DAYS[targetIdx],
      difficulty,
    };
  } else if (type === 3) { // Age logic
    const bAge = getRandomInt(10, 25);
    const diff = getRandomInt(3, 10);
    const aAge = bAge + diff;
    const futureYears = getRandomInt(4, 15);
    const futureSum = (aAge + futureYears) + (bAge + futureYears);

    return {
      type: 'logic',
      category: 'Age Puzzle',
      question: `Alice is ${diff} years older than Bob. Bob is ${bAge}. What will be the sum of their ages in ${futureYears} years?`,
      options: [`${futureSum}`, `${futureSum - 5}`, `${futureSum + 10}`, `${futureSum - futureYears}`].sort(() => Math.random() - 0.5),
      correctAnswer: `${futureSum}`,
      difficulty,
    };
  } else { // Code shift
    const words = ['CAT', 'DOG', 'PEN', 'BOX', 'SUN'];
    const word = words[getRandomInt(0, words.length - 1)];
    const shifted = word.split('').map((ch) => String.fromCharCode(ch.charCodeAt(0) + 1)).join('');
    const fake1 = word.split('').map((ch) => String.fromCharCode(ch.charCodeAt(0) - 1)).join('');

    return {
      type: 'logic',
      category: 'Code Deciphering',
      question: `If word letters are shifted by +1 (e.g. A → B), what does ${word} become?`,
      options: [shifted, fake1, word, shifted.split('').reverse().join('')].sort(() => Math.random() - 0.5),
      correctAnswer: shifted,
      difficulty,
    };
  }
}

export function getLogicQuestion(difficulty: Difficulty, seenQuestions?: Set<string>): Question {
  let attempt = 0;
  while (attempt < 20) {
    attempt++;
    let candidate: Omit<Question, 'id'>;

    if (Math.random() < 0.45) {
      candidate = generateProceduralLogic(difficulty);
    } else {
      const filtered = STATIC_LOGIC_BANK.filter((q) => q.difficulty === difficulty || difficulty === 'hard');
      const pool = filtered.length > 0 ? filtered : STATIC_LOGIC_BANK;
      candidate = pool[Math.floor(Math.random() * pool.length)];
    }

    if (!seenQuestions || !seenQuestions.has(candidate.question)) {
      if (seenQuestions) seenQuestions.add(candidate.question);
      return {
        ...candidate,
        id: `logic-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      };
    }
  }

  // Fallback
  const fallback = STATIC_LOGIC_BANK[0];
  return {
    ...fallback,
    id: `logic-fb-${Date.now()}`,
  };
}
