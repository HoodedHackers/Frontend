import React, { createContext, useState } from 'react';

export const PartidaContext = createContext();

export const PartidaProvider = ({ children }) => {
  const [partidaIniciada, setPartidaIniciada] = useState((sessionStorage.getItem("partidaIniciada") === "true") || false);

  const tiempoLimite = 120; // 2 minutos

  const [jugadores, setJugadores] = useState([]);

  const [posicionJugador, setPosicionJugador] = useState();

  //const [jugadorActualIndex, setJugadorActualIndex] = useState(parseInt(localStorage.getItem("jugadorActualIndex"), 10) || 0);
  const [jugadorActualIndex, setJugadorActualIndex] = useState(0);

  const [jugando, setJugando] = useState(false); // True si se ha elegido una carta de movimiento

  const [isOverlayVisible, setIsOverlayVisible] = useState();
  
  const [isOwner] = useState(sessionStorage.getItem("isOwner") === 'true');

  const [jugadorActualId, setJugadorActualId] = useState({});

  const [cartaMovimientoActualId, setCartaMovimientoActualId] = useState({});

  const [cartaMovimientoActualIndex, setCartaMovimientoActualIndex] = useState({});

  const [cantidadCartasMovimientoJugadorActual, setCantidadCartasMovimientoJugadorActual] = useState(null);

  const [isChatOpen, setIsChatOpen] = useState(true);

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
        handleMouseLeave,
        isOwner,
        jugadorActualId,
        setJugadorActualId,
        cartaMovimientoActualId,
        setCartaMovimientoActualId,
        cartaMovimientoActualIndex,
        setCartaMovimientoActualIndex,
        cantidadCartasMovimientoJugadorActual,
        setCantidadCartasMovimientoJugadorActual,
        isChatOpen,
        setIsChatOpen
      }}
    >
      {children}
    </PartidaContext.Provider>
  );
};
