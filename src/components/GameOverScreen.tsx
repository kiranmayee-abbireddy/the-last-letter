import React from 'react';
import { RotateCcw, Trophy } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart }) => {
  const isNewHighScore = score > highScore;
  
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-md">
      <h1 className="text-5xl font-bold mb-4 text-red-500">GAME OVER</h1>
      
      <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 mb-8 w-full">
        <div className="mb-6">
          <p className="text-2xl mb-2">Your Score</p>
          <p className="text-4xl font-bold text-purple-300">{score}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-xl mb-2 flex items-center justify-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            High Score
          </p>
          <p className="text-3xl font-bold text-yellow-400">{Math.max(score, highScore)}</p>
        </div>
        
        {isNewHighScore && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-md p-2 mb-4 animate-pulse">
            <p className="text-yellow-300 font-bold">New High Score!</p>
          </div>
        )}
      </div>
      
      <button 
        onClick={onRestart}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg shadow-purple-500/20 transition-transform hover:scale-105 flex items-center"
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        PLAY AGAIN
      </button>
    </div>
  );
};

export default GameOverScreen;