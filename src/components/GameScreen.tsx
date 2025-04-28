import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart } from 'lucide-react';
import { Letter, createLetter } from '../game/Letter';
import { useGame } from '../context/GameContext';
import SoundManager from '../utils/SoundManager';

interface GameScreenProps {
  onGameOver: (score: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [gameTime, setGameTime] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const spawnTimeRef = useRef<number>(0);
  const { difficulty, setDifficulty } = useGame();

  // Calculate base values for game difficulty
  const baseSpawnRate = 1500; // ms between spawns
  const spawnRate = baseSpawnRate / difficulty;
  const baseSpeed = 50; // pixels per second
  const letterSpeed = baseSpeed * difficulty;

  // Handle keyboard input
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    
    // Check if the key is a letter
    if (/^[a-z]$/.test(key)) {
      // Find the first letter that matches the key pressed
      const letterIndex = letters.findIndex(letter => letter.char.toLowerCase() === key);
      
      if (letterIndex !== -1) {
        // Play hit sound and remove the letter
        SoundManager.play('hit');
        setScore(prevScore => prevScore + 1);
        
        // Create a copy to avoid direct state mutation
        const newLetters = [...letters];
        // Add explosion property to the letter
        newLetters[letterIndex] = { ...newLetters[letterIndex], exploding: true };
        setLetters(newLetters);
        
        // Remove the letter after explosion animation completes
        setTimeout(() => {
          setLetters(prevLetters => 
            prevLetters.filter((_, index) => index !== letterIndex)
          );
        }, 300);
      } else {
        // Play miss sound if no matching letter
        SoundManager.play('miss');
      }
    }
  }, [letters]);

  // Add and remove keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Game loop using requestAnimationFrame
  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
      spawnTimeRef.current = timestamp;
    }
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Update game time
    setGameTime(prevTime => {
      const newTime = prevTime + deltaTime;
      
      // Increase difficulty every 15 seconds
      if (Math.floor(prevTime / 15000) < Math.floor(newTime / 15000)) {
        setDifficulty(prev => Math.min(prev + 0.2, 4));
      }
      
      return newTime;
    });

    // Spawn new letters
    if (timestamp - spawnTimeRef.current > spawnRate) {
      spawnTimeRef.current = timestamp;
      
      if (gameAreaRef.current) {
        const { width } = gameAreaRef.current.getBoundingClientRect();
        setLetters(prevLetters => [
          ...prevLetters,
          createLetter(width, letterSpeed)
        ]);
      }
    }

    // Update letter positions
    setLetters(prevLetters => {
      const gameAreaHeight = gameAreaRef.current?.clientHeight || 0;
      
      // Check for letters that reached the bottom
      const reachedBottom = prevLetters.filter(letter => 
        !letter.exploding && letter.y >= gameAreaHeight - 40
      );
      
      // If any letter reached the bottom, decrease health
      if (reachedBottom.length > 0) {
        SoundManager.play('damage');
        setHealth(h => {
          const newHealth = h - reachedBottom.length;
          return newHealth;
        });
      }
      
      // Update position of each letter
      return prevLetters
        .filter(letter => 
          letter.exploding || letter.y < gameAreaHeight - 40
        )
        .map(letter => ({
          ...letter,
          y: letter.y + (letter.speed * deltaTime / 1000)
        }));
    });

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [difficulty, letterSpeed, spawnRate, setDifficulty]);

  // Start and stop game loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop]);

  // Check health for game over
  useEffect(() => {
    if (health <= 0) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      onGameOver(score);
    }
  }, [health, onGameOver, score]);

  return (
    <div className="w-full max-w-3xl h-screen flex flex-col relative">
      {/* Game status bar */}
      <div className="flex justify-between items-center p-4 z-10">
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <Heart 
              key={i} 
              className={`${i < health ? 'text-red-500' : 'text-gray-700'} w-6 h-6`} 
              fill={i < health ? '#ef4444' : 'none'} 
            />
          ))}
        </div>
        <div className="text-xl font-bold text-purple-300">Score: {score}</div>
      </div>
      
      {/* Game area */}
      <div 
        ref={gameAreaRef} 
        className="flex-1 relative overflow-hidden border-t border-purple-900/40"
      >
        {letters.map((letter, index) => (
          <div 
            key={`${letter.id}-${index}`}
            className={`absolute text-2xl font-bold transform ${
              letter.exploding ? 'scale-150 opacity-0 transition-all duration-300' : ''
            }`}
            style={{ 
              left: `${letter.x}px`, 
              top: `${letter.y}px`,
              color: letter.color
            }}
          >
            {letter.char}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameScreen;