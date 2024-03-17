import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [gameId, setGameId] = useState(null);

  const value = {
    gameId,
    setGameId,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};