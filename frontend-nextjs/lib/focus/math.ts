import { Question, Difficulty } from './types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMathQuestion(difficulty: Difficulty): Question {
  const id = `math-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  let question = '';
  let answerNum = 0;

  if (difficulty === 'easy') {
    const op = getRandomInt(1, 4);
    if (op === 1) { // Add
      const a = getRandomInt(12, 50);
      const b = getRandomInt(15, 50);
      question = `${a} + ${b}`;
      answerNum = a + b;
    } else if (op === 2) { // Subtract
      const a = getRandomInt(30, 99);
      const b = getRandomInt(10, a - 5);
      question = `${a} - ${b}`;
      answerNum = a - b;
    } else if (op === 3) { // Multiply
      const a = getRandomInt(4, 12);
      const b = getRandomInt(4, 12);
      question = `${a} × ${b}`;
      answerNum = a * b;
    } else { // Divide
      const b = getRandomInt(3, 12);
      const ans = getRandomInt(3, 12);
      const a = b * ans;
      question = `${a} ÷ ${b}`;
      answerNum = ans;
    }
  } else if (difficulty === 'medium') {
    const type = getRandomInt(1, 3);
    if (type === 1) {
      const a = getRandomInt(25, 95);
      const b = getRandomInt(25, 95);
      question = `${a} + ${b}`;
      answerNum = a + b;
    } else if (type === 2) {
      const a = getRandomInt(13, 22);
      const b = getRandomInt(6, 14);
      question = `${a} × ${b}`;
      answerNum = a * b;
    } else {
      const b = getRandomInt(6, 16);
      const ans = getRandomInt(11, 25);
      const a = b * ans;
      question = `${a} ÷ ${b}`;
      answerNum = ans;
    }
  } else { // Hard
    const type = getRandomInt(1, 3);
    if (type === 1) { // (35 * 4) - 17
      const a = getRandomInt(15, 45);
      const b = getRandomInt(3, 8);
      const c = getRandomInt(10, 40);
      question = `(${a} × ${b}) - ${c}`;
      answerNum = (a * b) - c;
    } else if (type === 2) { // (48 / 6) + 13
      const b = getRandomInt(4, 12);
      const divRes = getRandomInt(6, 15);
      const a = b * divRes;
      const c = getRandomInt(15, 60);
      question = `(${a} ÷ ${b}) + ${c}`;
      answerNum = divRes + c;
    } else { // 144 / 12 + 27
      const b = getRandomInt(6, 15);
      const divRes = getRandomInt(8, 20);
      const a = b * divRes;
      const c = getRandomInt(25, 75);
      question = `${a} ÷ ${b} + ${c}`;
      answerNum = divRes + c;
    }
  }

  // Generate 3 plausible distractor options
  const options = new Set<string>();
  options.add(answerNum.toString());

  while (options.size < 4) {
    const delta = getRandomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
    const fake = answerNum + delta;
    if (fake > 0 && fake !== answerNum) {
      options.add(fake.toString());
    }
  }

  const sortedOptions = Array.from(options).sort(() => Math.random() - 0.5);

  return {
    id,
    type: 'math',
    question,
    options: sortedOptions,
    correctAnswer: answerNum.toString(),
    difficulty,
  };
}
