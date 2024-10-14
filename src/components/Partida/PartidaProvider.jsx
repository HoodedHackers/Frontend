import React, { createContext, useState } from 'react';

export const PartidaContext = createContext();

export const PartidaProvider = ({ children }) => {
  const [partidaIniciada, setPartidaIniciada] = useState(false);

  const tiempoLimite = 120; // 2 minutos

  const [jugadores, setJugadores] = useState([]);

  const [posicionJugador, setPosicionJugador] = useState();

  //const [jugadorActualIndex, setJugadorActualIndex] = useState(parseInt(localStorage.getItem("jugadorActualIndex"), 10) || 0);
  const [jugadorActualIndex, setJugadorActualIndex] = useState(0);

  const [jugando, setJugando] = useState(false); // True si se ha elegido una carta de movimiento

  const [isOverlayVisible, setIsOverlayVisible] = useState();

  const handleMouseEnter = () => {
    setIsOverlayVisible(true);
  };

  const handleMouseLeave = () => {
    setIsOverlayVisible(false);
  };

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
        jugadorActualIndex,
        setJugadorActualIndex,
        jugando,
        setJugando,
        isOverlayVisible,
        setIsOverlayVisible,
        handleMouseEnter,
        handleMouseLeave
      }}
    >
      {children}
    </PartidaContext.Provider>
  );
};
