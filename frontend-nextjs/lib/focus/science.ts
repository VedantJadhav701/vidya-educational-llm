import { Question, Difficulty } from './types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const STATIC_SCIENCE_BANK: Omit<Question, 'id'>[] = [
  // Physics
  { type: 'science', category: 'Physics', question: 'What is the SI unit of force?', options: ['Newton', 'Joule', 'Watt', 'Pascal'], correctAnswer: 'Newton', difficulty: 'easy' },
  { type: 'science', category: 'Physics', question: 'What is the SI unit of electric current?', options: ['Ampere', 'Volt', 'Ohm', 'Coulomb'], correctAnswer: 'Ampere', difficulty: 'easy' },
  { type: 'science', category: 'Physics', question: 'Which law states that F = m × a?', options: ["Newton's Second Law", "Newton's First Law", "Newton's Third Law", "Law of Gravitation"], correctAnswer: "Newton's Second Law", difficulty: 'easy' },
  { type: 'science', category: 'Physics', question: 'What is the speed of light in a vacuum?', options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'], correctAnswer: '3 × 10⁸ m/s', difficulty: 'medium' },
  { type: 'science', category: 'Physics', question: 'What is the SI unit of electrical resistance?', options: ['Ohm', 'Farad', 'Henry', 'Tesla'], correctAnswer: 'Ohm', difficulty: 'medium' },
  { type: 'science', category: 'Physics', question: 'What type of lens is used to correct Myopia (nearsightedness)?', options: ['Concave Lens', 'Convex Lens', 'Cylindrical Lens', 'Bifocal Lens'], correctAnswer: 'Concave Lens', difficulty: 'medium' },
  { type: 'science', category: 'Physics', question: 'What is the acceleration due to gravity near Earth\'s surface?', options: ['9.8 m/s²', '8.9 m/s²', '10.8 m/s²', '9.8 cm/s²'], correctAnswer: '9.8 m/s²', difficulty: 'easy' },
  { type: 'science', category: 'Physics', question: 'Which law states that energy cannot be created or destroyed?', options: ['Law of Conservation of Energy', 'Ohm\'s Law', 'Boyles Law', 'Second Law of Thermodynamics'], correctAnswer: 'Law of Conservation of Energy', difficulty: 'easy' },
  { type: 'science', category: 'Physics', question: 'What phenomenon causes light to bend when entering water from air?', options: ['Refraction', 'Reflection', 'Diffraction', 'Dispersion'], correctAnswer: 'Refraction', difficulty: 'easy' },

  // Chemistry
  { type: 'science', category: 'Chemistry', question: 'What is the chemical formula of water?', options: ['H₂O', 'CO₂', 'H₂O₂', 'HO₂'], correctAnswer: 'H₂O', difficulty: 'easy' },
  { type: 'science', category: 'Chemistry', question: 'What is the atomic number of Carbon?', options: ['6', '12', '8', '14'], correctAnswer: '6', difficulty: 'easy' },
  { type: 'science', category: 'Chemistry', question: 'Which gas is most abundant in Earth\'s atmosphere?', options: ['Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Argon'], correctAnswer: 'Nitrogen', difficulty: 'easy' },
  { type: 'science', category: 'Chemistry', question: 'What is the pH of pure water at 25°C?', options: ['7', '0', '14', '5'], correctAnswer: '7', difficulty: 'medium' },
  { type: 'science', category: 'Chemistry', question: 'Which element has the chemical symbol Na?', options: ['Sodium', 'Nickel', 'Nitrogen', 'Neon'], correctAnswer: 'Sodium', difficulty: 'medium' },
  { type: 'science', category: 'Chemistry', question: 'What is the molecular formula of Ozone?', options: ['O₃', 'O₂', 'CO₃', 'NO₃'], correctAnswer: 'O₃', difficulty: 'easy' },
  { type: 'science', category: 'Chemistry', question: 'Which acid is found in vinegar?', options: ['Acetic Acid', 'Citric Acid', 'Hydrochloric Acid', 'Sulfuric Acid'], correctAnswer: 'Acetic Acid', difficulty: 'medium' },
  { type: 'science', category: 'Chemistry', question: 'What is the chemical formula of Table Salt?', options: ['NaCl', 'KCl', 'CaCl₂', 'Na₂CO₃'], correctAnswer: 'NaCl', difficulty: 'easy' },
  { type: 'science', category: 'Chemistry', question: 'Which metal is liquid at room temperature?', options: ['Mercury', 'Gallium', 'Bromine', 'Sodium'], correctAnswer: 'Mercury', difficulty: 'medium' },

  // Biology
  { type: 'science', category: 'Biology', question: 'Which organelle contains genetic material (DNA) in eukaryotic cells?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'], correctAnswer: 'Nucleus', difficulty: 'easy' },
  { type: 'science', category: 'Biology', question: 'Which organelle is known as the powerhouse of the cell?', options: ['Mitochondria', 'Chloroplast', 'Lysosome', 'Endoplasmic Reticulum'], correctAnswer: 'Mitochondria', difficulty: 'easy' },
  { type: 'science', category: 'Biology', question: 'What pigment absorbs sunlight for photosynthesis?', options: ['Chlorophyll', 'Carotene', 'Xanthophyll', 'Hemoglobin'], correctAnswer: 'Chlorophyll', difficulty: 'easy' },
  { type: 'science', category: 'Biology', question: 'How many chambers are in the human heart?', options: ['4', '2', '3', '6'], correctAnswer: '4', difficulty: 'medium' },
  { type: 'science', category: 'Biology', question: 'Which blood vessels carry oxygenated blood away from the heart?', options: ['Arteries', 'Veins', 'Capillaries', 'Venules'], correctAnswer: 'Arteries', difficulty: 'medium' },
  { type: 'science', category: 'Biology', question: 'What is the functional unit of the human kidney?', options: ['Nephron', 'Neuron', 'Alveoli', 'Hepatocyte'], correctAnswer: 'Nephron', difficulty: 'medium' },
  { type: 'science', category: 'Biology', question: 'Which blood cells are responsible for immune defense against infections?', options: ['White Blood Cells (Leukocytes)', 'Red Blood Cells (Erythrocytes)', 'Platelets', 'Plasma'], correctAnswer: 'White Blood Cells (Leukocytes)', difficulty: 'easy' },
  { type: 'science', category: 'Biology', question: 'What is the process of cell division that produces 4 haploid gametes?', options: ['Meiosis', 'Mitosis', 'Binary Fission', 'Budding'], correctAnswer: 'Meiosis', difficulty: 'medium' },
  { type: 'science', category: 'Biology', question: 'Which gas is released by plants during photosynthesis?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Methane'], correctAnswer: 'Oxygen', difficulty: 'easy' },
];

function generateProceduralScience(difficulty: Difficulty): Omit<Question, 'id'> {
  const choice = getRandomInt(1, 4);
  if (choice === 1) { // Ohm's Law V = I * R
    const i = getRandomInt(2, 10);
    const r = getRandomInt(3, 20);
    const v = i * r;
    return {
      type: 'science',
      category: 'Physics',
      question: `Calculate Voltage (V) when Current I = ${i} A and Resistance R = ${r} Ω`,
      options: [`${v} V`, `${v + 5} V`, `${i + r} V`, `${v - 3} V`].sort(() => Math.random() - 0.5),
      correctAnswer: `${v} V`,
      difficulty,
    };
  } else if (choice === 2) { // Kinetic Energy Ek = 1/2 m v^2
    const m = getRandomInt(2, 8) * 2; // Even mass
    const v = getRandomInt(2, 6);
    const ek = 0.5 * m * v * v;
    return {
      type: 'science',
      category: 'Physics',
      question: `Calculate Kinetic Energy for mass = ${m} kg moving at velocity = ${v} m/s`,
      options: [`${ek} J`, `${ek * 2} J`, `${ek + 10} J`, `${m * v} J`].sort(() => Math.random() - 0.5),
      correctAnswer: `${ek} J`,
      difficulty,
    };
  } else if (choice === 3) { // Density = mass / volume
    const vol = getRandomInt(2, 8);
    const density = getRandomInt(2, 10);
    const mass = density * vol;
    return {
      type: 'science',
      category: 'Physics',
      question: `Find Density if mass = ${mass} g and volume = ${vol} cm³`,
      options: [`${density} g/cm³`, `${density + 2} g/cm³`, `${mass + vol} g/cm³`, `${density * 2} g/cm³`].sort(() => Math.random() - 0.5),
      correctAnswer: `${density} g/cm³`,
      difficulty,
    };
  } else { // Atomic mass calculation
    const elements = [
      { name: 'Water (H₂O)', mass: 18 },
      { name: 'Carbon Dioxide (CO₂)', mass: 44 },
      { name: 'Methane (CH₄)', mass: 16 },
      { name: 'Ammonia (NH₃)', mass: 17 },
      { name: 'Sulfuric Acid (H₂SO₄)', mass: 98 },
    ];
    const item = elements[getRandomInt(0, elements.length - 1)];
    return {
      type: 'science',
      category: 'Chemistry',
      question: `What is the molar mass of ${item.name}?`,
      options: [`${item.mass} g/mol`, `${item.mass + 4} g/mol`, `${item.mass - 6} g/mol`, `${item.mass + 10} g/mol`].sort(() => Math.random() - 0.5),
      correctAnswer: `${item.mass} g/mol`,
      difficulty,
    };
  }
}

export function getScienceQuestion(difficulty: Difficulty, seenQuestions?: Set<string>): Question {
  let attempt = 0;
  while (attempt < 20) {
    attempt++;
    let candidate: Omit<Question, 'id'>;

    if (Math.random() < 0.4) {
      candidate = generateProceduralScience(difficulty);
    } else {
      const filtered = STATIC_SCIENCE_BANK.filter((q) => q.difficulty === difficulty || difficulty === 'hard');
      const pool = filtered.length > 0 ? filtered : STATIC_SCIENCE_BANK;
      candidate = pool[Math.floor(Math.random() * pool.length)];
    }

    if (!seenQuestions || !seenQuestions.has(candidate.question)) {
      if (seenQuestions) seenQuestions.add(candidate.question);
      return {
        ...candidate,
        id: `science-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      };
    }
  }

  // Fallback
  const fallback = STATIC_SCIENCE_BANK[0];
  return {
    ...fallback,
    id: `science-fb-${Date.now()}`,
  };
}
