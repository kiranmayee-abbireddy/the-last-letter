import { v4 as uuidv4 } from 'uuid';

export interface Letter {
  id: string;
  char: string;
  x: number;
  y: number;
  speed: number;
  color: string;
  exploding?: boolean;
}

// Array of neon colors for letters
const NEON_COLORS = [
  '#f43f5e', // neon red
  '#ec4899', // neon pink
  '#8b5cf6', // neon purple
  '#3b82f6', // neon blue
  '#10b981', // neon green
  '#f59e0b', // neon orange
  '#06b6d4', // neon cyan
];

// Generate a random letter from A to Z
const getRandomLetter = (): string => {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
};

// Get a random neon color
const getRandomColor = (): string => {
  return NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
};

// Create a new letter with random properties
export const createLetter = (areaWidth: number, baseSpeed: number): Letter => {
  // Add some randomness to speed
  const speedVariation = Math.random() * 0.4 + 0.8; // 0.8 to 1.2 multiplier
  
  return {
    id: uuidv4(),
    char: getRandomLetter(),
    x: Math.random() * (areaWidth - 40) + 20, // Position horizontally
    y: -30, // Start above the visible area
    speed: baseSpeed * speedVariation,
    color: getRandomColor(),
  };
};