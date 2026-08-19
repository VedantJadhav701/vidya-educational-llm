import { Question, Difficulty } from './types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generatePatternQuestion(difficulty: Difficulty): Question {
  const id = `pattern-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  let sequence: number[] = [];
  let nextVal = 0;

  if (difficulty === 'easy') {
    const type = getRandomInt(1, 3);
    if (type === 1) { // Doubling
      const start = getRandomInt(2, 5);
      sequence = [start, start * 2, start * 4, start * 8];
      nextVal = start * 16;
    } else if (type === 2) { // Arithmetic step
      const step = getRandomInt(3, 7);
      const start = getRandomInt(1, 10);
      sequence = [start, start + step, start + step * 2, start + step * 3];
      nextVal = start + step * 4;
    } else { // Squares n^2
      const start = getRandomInt(1, 3);
      sequence = Array.from({ length: 4 }, (_, i) => Math.pow(start + i, 2));
      nextVal = Math.pow(start + 4, 2);
    }
  } else if (difficulty === 'medium') {
    const type = getRandomInt(1, 3);
    if (type === 1) { // +3, +5, +7, +9...
      let curr = getRandomInt(2, 6);
      let step = 3;
      sequence = [curr];
      for (let i = 0; i < 4; i++) {
        curr += step;
        sequence.push(curr);
        step += 2;
      }
      nextVal = curr + step;
      sequence.pop(); // keep 5 elements
    } else if (type === 2) { // Triangular +1, +2, +3, +4...
      let curr = getRandomInt(1, 5);
      let step = 1;
      sequence = [curr];
      for (let i = 0; i < 4; i++) {
        curr += step;
        sequence.push(curr);
        step += 1;
      }
      nextVal = curr + step;
      sequence.pop();
    } else { // Alternating (+4, -2)
      let curr = getRandomInt(10, 20);
      sequence = [curr];
      for (let i = 0; i < 2; i++) {
        curr += 5;
        sequence.push(curr);
        curr -= 2;
        sequence.push(curr);
      }
      curr += 5;
      nextVal = curr;
    }
  } else { // Hard
    const type = getRandomInt(1, 3);
    if (type === 1) { // Fibonacci
      const a = getRandomInt(1, 4);
      const b = getRandomInt(a, a + 3);
      sequence = [a, b, a + b, a + 2 * b, 2 * a + 3 * b];
      nextVal = 3 * a + 5 * b;
    } else if (type === 2) { // Cubes n^3
      const start = getRandomInt(1, 3);
      sequence = Array.from({ length: 4 }, (_, i) => Math.pow(start + i, 3));
      nextVal = Math.pow(start + 4, 3);
    } else { // Geometric powers (3^n)
      const base = 3;
      const startPower = getRandomInt(1, 2);
      sequence = Array.from({ length: 4 }, (_, i) => Math.pow(base, startPower + i));
      nextVal = Math.pow(base, startPower + 4);
    }
  }

  const question = `${sequence.join(', ')}, ?`;
  const correctAnswer = nextVal.toString();

  // Generate distractors
  const options = new Set<string>();
  options.add(correctAnswer);

  while (options.size < 4) {
    const delta = getRandomInt(1, 6) * (Math.random() > 0.5 ? 1 : -1);
    const fake = nextVal + delta;
    if (fake > 0 && fake !== nextVal) {
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
