import { Question, Difficulty } from './types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79];

export function generatePatternQuestion(difficulty: Difficulty, seenQuestions?: Set<string>): Question {
  let attempt = 0;
  while (attempt < 15) {
    attempt++;
    const id = `pattern-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let sequence: number[] = [];
    let nextVal = 0;

    if (difficulty === 'easy') {
      const type = getRandomInt(1, 5);
      if (type === 1) { // Doubling / Tripling
        const mult = getRandomInt(2, 3);
        const start = getRandomInt(2, 6);
        sequence = [start, start * mult, start * mult * mult, start * Math.pow(mult, 3)];
        nextVal = start * Math.pow(mult, 4);
      } else if (type === 2) { // Linear step (+3, +4, +5...)
        const step = getRandomInt(3, 9);
        const start = getRandomInt(1, 15);
        sequence = [start, start + step, start + step * 2, start + step * 3];
        nextVal = start + step * 4;
      } else if (type === 3) { // Squares n^2
        const start = getRandomInt(1, 5);
        sequence = Array.from({ length: 4 }, (_, i) => Math.pow(start + i, 2));
        nextVal = Math.pow(start + 4, 2);
      } else if (type === 4) { // Countdown subtraction (-5, -6...)
        const step = getRandomInt(4, 10);
        const start = getRandomInt(50, 90);
        sequence = [start, start - step, start - step * 2, start - step * 3];
        nextVal = start - step * 4;
      } else { // Halving
        const start = getRandomInt(2, 6) * 16;
        sequence = [start, start / 2, start / 4, start / 8];
        nextVal = start / 16;
      }
    } else if (difficulty === 'medium') {
      const type = getRandomInt(1, 6);
      if (type === 1) { // Step acceleration (+3, +5, +7, +9...)
        let curr = getRandomInt(2, 10);
        let step = getRandomInt(2, 5);
        sequence = [curr];
        for (let i = 0; i < 4; i++) {
          curr += step;
          sequence.push(curr);
          step += 2;
        }
        nextVal = curr + step;
        sequence.pop();
      } else if (type === 2) { // Triangular numbers (+1, +2, +3, +4...)
        let curr = getRandomInt(1, 8);
        let step = 1;
        sequence = [curr];
        for (let i = 0; i < 4; i++) {
          curr += step;
          sequence.push(curr);
          step += 1;
        }
        nextVal = curr + step;
        sequence.pop();
      } else if (type === 3) { // Alternating (+k1, -k2)
        const addK = getRandomInt(4, 8);
        const subK = getRandomInt(1, 3);
        let curr = getRandomInt(10, 25);
        sequence = [curr];
        for (let i = 0; i < 2; i++) {
          curr += addK;
          sequence.push(curr);
          curr -= subK;
          sequence.push(curr);
        }
        curr += addK;
        nextVal = curr;
      } else if (type === 4) { // Prime sub-sequence
        const startIdx = getRandomInt(0, 10);
        sequence = PRIMES.slice(startIdx, startIdx + 4);
        nextVal = PRIMES[startIdx + 4];
      } else if (type === 5) { // Square offsets (n^2 + k)
        const offset = getRandomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
        const start = getRandomInt(2, 5);
        sequence = Array.from({ length: 4 }, (_, i) => Math.pow(start + i, 2) + offset);
        nextVal = Math.pow(start + 4, 2) + offset;
      } else { // Multiplicative add (x * 2 + 1)
        const add = getRandomInt(1, 3);
        let curr = getRandomInt(2, 5);
        sequence = [curr];
        for (let i = 0; i < 3; i++) {
          curr = curr * 2 + add;
          sequence.push(curr);
        }
        nextVal = curr * 2 + add;
      }
    } else { // Hard
      const type = getRandomInt(1, 5);
      if (type === 1) { // Fibonacci variant
        const a = getRandomInt(1, 5);
        const b = getRandomInt(a + 1, a + 5);
        sequence = [a, b, a + b, a + 2 * b, 2 * a + 3 * b];
        nextVal = 3 * a + 5 * b;
      } else if (type === 2) { // Cubes n^3
        const start = getRandomInt(1, 4);
        sequence = Array.from({ length: 4 }, (_, i) => Math.pow(start + i, 3));
        nextVal = Math.pow(start + 4, 3);
      } else if (type === 3) { // Geometric powers (3^n or 4^n)
        const base = getRandomInt(3, 4);
        const startPower = getRandomInt(1, 2);
        sequence = Array.from({ length: 4 }, (_, i) => Math.pow(base, startPower + i));
        nextVal = Math.pow(base, startPower + 4);
      } else if (type === 4) { // Dual interleaved sequence (10, 100, 12, 90, 14, 80, 16, ?)
        let a = getRandomInt(5, 15);
        let b = getRandomInt(80, 100);
        sequence = [a, b, a + 2, b - 10, a + 4, b - 20, a + 6];
        nextVal = b - 30;
      } else { // Cube offsets (n^3 - 1)
        const start = getRandomInt(1, 3);
        sequence = Array.from({ length: 4 }, (_, i) => Math.pow(start + i, 3) - 1);
        nextVal = Math.pow(start + 4, 3) - 1;
      }
    }

    const question = `${sequence.join(', ')}, ?`;
    const correctAnswer = nextVal.toString();

    if (!seenQuestions || !seenQuestions.has(question)) {
      if (seenQuestions) seenQuestions.add(question);

      // Generate distractors
      const options = new Set<string>();
      options.add(correctAnswer);

      while (options.size < 4) {
        const delta = getRandomInt(1, 8) * (Math.random() > 0.5 ? 1 : -1);
        const fake = nextVal + delta;
        if (fake >= 0 && fake !== nextVal) {
          options.add(fake.toString());
        }
      }

      const sortedOptions = Array.from(options).sort(() => Math.random() - 0.5);

      return {
        id,
        type: 'pattern',
        question,
        options: sortedOptions,
        correctAnswer,
        difficulty,
      };
    }
  }

  // Fallback
  return {
    id: `pattern-fb-${Date.now()}`,
    type: 'pattern',
    question: `2, 4, 8, 16, ?`,
    options: ['32', '24', '30', '28'],
    correctAnswer: '32',
    difficulty,
  };
}
