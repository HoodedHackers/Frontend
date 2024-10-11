import React, { createContext, useState, useEffect, useContext } from 'react';

export const PartidaContext = createContext();

export const PartidaProvider = ({ children }) => {
  const [partidaIniciada, setPartidaIniciada] = useState(false);

  const tiempoLimite = 120; // 2 minutos

  const [jugadores, setJugadores] = useState([]);

  const [posicionJugador, setPosicionJugador] = useState();

  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  return (
    <PartidaContext.Provider
      value={{
        partidaIniciada,
        setPartidaIniciada,
        tiempoLimite,
        jugadores,
        setJugadores,
        posicionJugador,
        setPosicionJugador,
        isOverlayVisible,
        setIsOverlayVisible
      }}
    >
      {children}
    </PartidaContext.Provider>
  );
};
