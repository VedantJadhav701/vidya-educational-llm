import { Question, Difficulty } from './types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMathQuestion(difficulty: Difficulty, seenQuestions?: Set<string>): Question {
  let attempt = 0;
  while (attempt < 15) {
    attempt++;
    const id = `math-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let question = '';
    let answerNum = 0;

    if (difficulty === 'easy') {
      const type = getRandomInt(1, 6);
      if (type === 1) { // Basic Addition
        const a = getRandomInt(12, 99);
        const b = getRandomInt(15, 99);
        question = `${a} + ${b}`;
        answerNum = a + b;
      } else if (type === 2) { // Basic Subtraction
        const a = getRandomInt(45, 150);
        const b = getRandomInt(12, a - 5);
        question = `${a} - ${b}`;
        answerNum = a - b;
      } else if (type === 3) { // Multiplication
        const a = getRandomInt(4, 15);
        const b = getRandomInt(4, 15);
        question = `${a} × ${b}`;
        answerNum = a * b;
      } else if (type === 4) { // Division
        const b = getRandomInt(3, 15);
        const ans = getRandomInt(4, 16);
        const a = b * ans;
        question = `${a} ÷ ${b}`;
        answerNum = ans;
      } else if (type === 5) { // Simple 3-term sum
        const a = getRandomInt(10, 40);
        const b = getRandomInt(10, 40);
        const c = getRandomInt(10, 40);
        question = `${a} + ${b} + ${c}`;
        answerNum = a + b + c;
      } else { // Percentage easy
        const pct = [10, 20, 25, 50][getRandomInt(0, 3)];
        const base = getRandomInt(2, 10) * 20;
        question = `${pct}% of ${base}`;
        answerNum = (pct / 100) * base;
      }
    } else if (difficulty === 'medium') {
      const type = getRandomInt(1, 7);
      if (type === 1) { // 2-digit multiplication
        const a = getRandomInt(14, 25);
        const b = getRandomInt(6, 16);
        question = `${a} × ${b}`;
        answerNum = a * b;
      } else if (type === 2) { // (a * b) + c
        const a = getRandomInt(6, 16);
        const b = getRandomInt(5, 12);
        const c = getRandomInt(15, 60);
        question = `(${a} × ${b}) + ${c}`;
        answerNum = a * b + c;
      } else if (type === 3) { // (a - b) * c
        const a = getRandomInt(20, 50);
        const b = getRandomInt(5, a - 5);
        const c = getRandomInt(3, 9);
        question = `(${a} - ${b}) × ${c}`;
        answerNum = (a - b) * c;
      } else if (type === 4) { // Square numbers
        const n = getRandomInt(8, 20);
        question = `${n}²`;
        answerNum = n * n;
      } else if (type === 5) { // Square root
        const ans = getRandomInt(6, 20);
        const sq = ans * ans;
        question = `√${sq}`;
        answerNum = ans;
      } else if (type === 6) { // Algebra linear
        const x = getRandomInt(3, 12);
        const m = getRandomInt(2, 6);
        const c = getRandomInt(5, 25);
        const rhs = m * x + c;
        question = `If ${m}x + ${c} = ${rhs}, find x`;
        answerNum = x;
      } else { // Percentage medium
        const pct = [15, 30, 40, 75][getRandomInt(0, 3)];
        const base = getRandomInt(4, 20) * 10;
        question = `${pct}% of ${base}`;
        answerNum = (pct / 100) * base;
      }
    } else { // Hard
      const type = getRandomInt(1, 7);
      if (type === 1) { // Nested arithmetic
        const a = getRandomInt(15, 45);
        const b = getRandomInt(4, 9);
        const c = getRandomInt(12, 35);
        const d = getRandomInt(2, 5);
        question = `(${a} × ${b}) - (${c} × ${d})`;
        answerNum = a * b - c * d;
      } else if (type === 2) { // Powers
        const base = getRandomInt(2, 5);
        const exp = getRandomInt(3, 5);
        question = `${base}^${exp}`;
        answerNum = Math.pow(base, exp);
      } else if (type === 3) { // Pythogorean hypotenuse / sum of squares
        const a = getRandomInt(5, 12);
        const b = getRandomInt(5, 12);
        question = `${a}² + ${b}²`;
        answerNum = a * a + b * b;
      } else if (type === 4) { // Algebra quadratic root
        const ans = getRandomInt(3, 15);
        const sq = ans * ans;
        question = `If x² - ${sq} = 0, find positive x`;
        answerNum = ans;
      } else if (type === 5) { // Modulo arithmetic
        const b = getRandomInt(7, 16);
        const q = getRandomInt(5, 15);
        const r = getRandomInt(1, b - 1);
        const a = b * q + r;
        question = `${a} mod ${b}`;
        answerNum = r;
      } else if (type === 6) { // Average of 4 numbers
        const ans = getRandomInt(15, 40);
        const a = ans - getRandomInt(2, 8);
        const b = ans + getRandomInt(2, 8);
        const c = ans - getRandomInt(1, 5);
        const d = 4 * ans - (a + b + c);
        question = `Average of ${a}, ${b}, ${c}, ${d}`;
        answerNum = ans;
      } else { // Mixed division and addition
        const b = getRandomInt(6, 14);
        const divRes = getRandomInt(9, 22);
        const a = b * divRes;
        const c = getRandomInt(25, 85);
        question = `(${a} ÷ ${b}) + ${c}`;
        answerNum = divRes + c;
      }
    }

    if (!seenQuestions || !seenQuestions.has(question)) {
      if (seenQuestions) seenQuestions.add(question);

      // Generate 3 plausible distractor options
      const options = new Set<string>();
      options.add(answerNum.toString());

      while (options.size < 4) {
        const delta = getRandomInt(1, 6) * (Math.random() > 0.5 ? 1 : -1);
        const fake = answerNum + delta;
        if (fake >= 0 && fake !== answerNum) {
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
  }

  // Fallback if loop exceeded attempts
  return {
    id: `math-fb-${Date.now()}`,
    type: 'math',
    question: `45 + 55`,
    options: ['100', '90', '110', '95'],
    correctAnswer: '100',
    difficulty,
  };
}
