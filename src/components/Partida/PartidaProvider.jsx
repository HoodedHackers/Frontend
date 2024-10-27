import React, { createContext, useState } from 'react';

export const PartidaContext = createContext();

export const PartidaProvider = ({ children }) => {
  const [partidaIniciada, setPartidaIniciada] = useState((sessionStorage.getItem("partidaIniciada") === "true") || false);

  const tiempoLimite = 120; // 2 minutos

  const [jugadores, setJugadores] = useState([]);

  const [posicionJugador, setPosicionJugador] = useState();

  const [jugadorActualIndex, setJugadorActualIndex] = useState(0);

  const [jugando, setJugando] = useState(false);

  const [isOverlayVisible, setIsOverlayVisible] = useState();
  
  const [isOwner] = useState(sessionStorage.getItem("isOwner") === 'true');

  const [jugadorActualId, setJugadorActualId] = useState({});

  const [cartaMovimientoActualId, setCartaMovimientoActualId] = useState({});

  const [cartaMovimientoActualIndex, setCartaMovimientoActualIndex] = useState({});

  const [cantidadCartasMovimientoJugadorActual, setCantidadCartasMovimientoJugadorActual] = useState(null);

  const [cancelarHabilitado, setCancelarHabilitado] = useState(false);



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
        cancelarHabilitado,
        setCancelarHabilitado
    
      }}
    >
      {children}
    </PartidaContext.Provider>
  );
};
