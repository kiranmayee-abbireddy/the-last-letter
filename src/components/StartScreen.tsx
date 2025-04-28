import React from 'react';
import { Keyboard, Volume2, VolumeX } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  const { isMuted, toggleMute } = useGame();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
      <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        THE LAST LETTER
      </h1>
      
      <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 mb-8">
        <h2 className="text-xl mb-4 text-purple-300">Type to survive!</h2>
        
        <div className="mb-4 flex items-center justify-center">
          <Keyboard className="w-6 h-6 mr-2 text-purple-300" />
          <p className="text-gray-300">Press the matching letters before they reach the bottom</p>
        </div>
        
        <div className="flex flex-col space-y-2 text-sm text-left mb-4">
          <p className="text-gray-400">• Letters fall from the top</p>
          <p className="text-gray-400">• Type to destroy them</p>
          <p className="text-gray-400">• Miss 3 letters and it's game over</p>
        </div>
        
        {highScore > 0 && (
          <p className="text-yellow-400 mt-2">High Score: {highScore}</p>
        )}
      </div>
      
      <button 
        onClick={onStart}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg shadow-purple-500/20 transition-transform hover:scale-105 mb-4"
      >
        START GAME
      </button>
      
      <button 
        onClick={toggleMute} 
        className="flex items-center justify-center p-2 text-gray-400 hover:text-white transition-colors"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </div>
  );
};

export default StartScreen;