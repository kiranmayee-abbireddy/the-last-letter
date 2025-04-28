import React, { useState, useEffect } from 'react';
import GameScreen from './components/GameScreen';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import { GameProvider } from './context/GameContext';
import SoundManager from './utils/SoundManager';

// Initialize sound manager
SoundManager.initialize();

function App() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('lastLetterHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score to localStorage when game ends
  useEffect(() => {
    if (gameState === 'gameOver' && score > highScore) {
      setHighScore(score);
      localStorage.setItem('lastLetterHighScore', score.toString());
    }
  }, [gameState, score, highScore]);

  const startGame = () => {
    setScore(0);
    setGameState('playing');
    SoundManager.play('start');
  };

  const endGame = (finalScore: number) => {
    setScore(finalScore);
    setGameState('gameOver');
    SoundManager.play('gameOver');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden font-mono text-white">
      <GameProvider>
        {gameState === 'start' && (
          <StartScreen onStart={startGame} highScore={highScore} />
        )}
        
        {gameState === 'playing' && (
          <GameScreen onGameOver={endGame} />
        )}
        
        {gameState === 'gameOver' && (
          <GameOverScreen 
            score={score} 
            highScore={highScore} 
            onRestart={startGame} 
          />
        )}
      </GameProvider>
    </div>
  );
}

export default App;