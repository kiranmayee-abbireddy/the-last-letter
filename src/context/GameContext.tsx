import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GameContextType {
  difficulty: number;
  setDifficulty: (level: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [difficulty, setDifficulty] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const value = {
    difficulty,
    setDifficulty,
    isMuted,
    toggleMute
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}