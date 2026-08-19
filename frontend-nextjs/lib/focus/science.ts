import { Question, Difficulty } from './types';

const SCIENCE_BANK: Omit<Question, 'id'>[] = [
  // Physics
  {
    type: 'science',
    category: 'Physics',
    question: 'What is the SI unit of force?',
    options: ['Newton', 'Joule', 'Watt', 'Pascal'],
    correctAnswer: 'Newton',
    difficulty: 'easy',
  },
  {
    type: 'science',
    category: 'Physics',
    question: 'What is the SI unit of electric current?',
    options: ['Ampere', 'Volt', 'Ohm', 'Coulomb'],
    correctAnswer: 'Ampere',
    difficulty: 'easy',
  },
  {
    type: 'science',
    category: 'Physics',
    question: 'Which law states that F = m × a?',
    options: ["Newton's Second Law", "Newton's First Law", "Newton's Third Law", "Law of Gravitation"],
    correctAnswer: "Newton's Second Law",
    difficulty: 'easy',
  },
  {
    type: 'science',
    category: 'Physics',
    question: 'What is the speed of light in a vacuum?',
    options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'],
    correctAnswer: '3 × 10⁸ m/s',
    difficulty: 'medium',
  },
  {
    type: 'science',
    category: 'Physics',
    question: 'What is the SI unit of electrical resistance?',
    options: ['Ohm', 'Farad', 'Henry', 'Tesla'],
    correctAnswer: 'Ohm',
    difficulty: 'medium',
  },

  // Chemistry
  {
    type: 'science',
    category: 'Chemistry',
    question: 'What is the chemical formula of water?',
    options: ['H₂O', 'CO₂', 'H₂O₂', 'HO₂'],
    correctAnswer: 'H₂O',
    difficulty: 'easy',
  },
  {
    type: 'science',
    category: 'Chemistry',
    question: 'What is the atomic number of Carbon?',
    options: ['6', '12', '8', '14'],
    correctAnswer: '6',
    difficulty: 'easy',
  },
  {
    type: 'science',
    category: 'Chemistry',
    question: 'Which gas is most abundant in Earth\'s atmosphere?',
    options: ['Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Argon'],
    correctAnswer: 'Nitrogen',
    difficulty: 'easy',
  },
  {
    type: 'science',
    category: 'Chemistry',
    question: 'What is the pH of pure water at 25°C?',
    options: ['7', '0', '14', '5'],
    correctAnswer: '7',
    difficulty: 'medium',
  },
  {
    type: 'science',
    category: 'Chemistry',
    question: 'Which element has the chemical symbol Na?',
    options: ['Sodium', 'Nickel', 'Nitrogen', 'Neon'],
    correctAnswer: 'Sodium',
    difficulty: 'medium',
  },

  // Biology
  {
    type: 'science',
    category: 'Biology',
    question: 'Which organelle contains genetic material (DNA) in eukaryotic cells?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
    correctAnswer: 'Nucleus',
    difficulty: 'easy',
  },
  {
    type: 'science',
    category: 'Biology',
    question: 'Which organelle is known as the powerhouse of the cell?',
    options: ['Mitochondria', 'Chloroplast', 'Lysosome', 'Endoplasmic Reticulum'],
    correctAnswer: 'Mitochondria',
    difficulty: 'easy',
  },
  {
    type: 'science',
    category: 'Biology',
    question: 'What pigment absorbs sunlight for photosynthesis?',
    options: ['Chlorophyll', 'Carotene', 'Xanthophyll', 'Hemoglobin'],
    correctAnswer: 'Chlorophyll',
    difficulty: 'easy',
  },
  {
    type: 'science',
    category: 'Biology',
    question: 'How many chambers are in the human heart?',
    options: ['4', '2', '3', '6'],
    correctAnswer: '4',
    difficulty: 'medium',
  },
  {
    type: 'science',
    category: 'Biology',
    question: 'Which blood vessels carry oxygenated blood away from the heart?',
    options: ['Arteries', 'Veins', 'Capillaries', 'Venules'],
    correctAnswer: 'Arteries',
    difficulty: 'medium',
  },
];

export function getScienceQuestion(difficulty: Difficulty): Question {
  const filtered = SCIENCE_BANK.filter((q) => q.difficulty === difficulty || difficulty === 'hard');
  const selected = filtered[Math.floor(Math.random() * filtered.length)] || SCIENCE_BANK[0];
  
  return {
    ...selected,
    id: `science-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  };
}
