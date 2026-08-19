import { MemoryGridConfig, Difficulty } from './types';

export function generateMemoryConfig(difficulty: Difficulty): MemoryGridConfig {
  let size = 3;
  let count = 3;
  let displayDurationMs = 2000;

  if (difficulty === 'medium') {
    size = 4;
    count = 5;
    displayDurationMs = 2500;
  } else if (difficulty === 'hard') {
    size = 5;
    count = 7;
    displayDurationMs = 3000;
  }

  const totalCells = size * size;
  const highlightedCells = new Set<number>();

  while (highlightedCells.size < count) {
    const cell = Math.floor(Math.random() * totalCells);
    highlightedCells.add(cell);
  }

  return {
    size,
    highlightedCells: Array.from(highlightedCells),
    displayDurationMs,
  };
}
