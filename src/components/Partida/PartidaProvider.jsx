import React, { createContext, useState } from 'react';

export const PartidaContext = createContext();

export const PartidaProvider = ({ children }) => {
  const [partidaIniciada, setPartidaIniciada] = useState((sessionStorage.getItem("partidaIniciada") === "true") || false);

  const tiempoLimite = 120; // 2 minutos

  const [jugadores, setJugadores] = useState([]);

  const [colorBloqueado]=useState(sessionStorage.getItem("colorBloqueado")|| "#f52020");

  const [posicionJugador, setPosicionJugador] = useState();

  //const [jugadorActualIndex, setJugadorActualIndex] = useState(parseInt(localStorage.getItem("jugadorActualIndex"), 10) || 0);
  const [jugadorActualIndex, setJugadorActualIndex] = useState(0);

  const [jugando, setJugando] = useState(false); // True si se ha elegido una carta de movimiento

  const [isOverlayVisible, setIsOverlayVisible] = useState();

  const [isOwner] = useState(sessionStorage.getItem("isOwner") === 'true');

  const [seleccionada, setSeleccionada] = useState(null);

  const [jugadorActualId, setJugadorActualId] = useState({});

  const [cartaMovimientoActualId, setCartaMovimientoActualId] = useState({});

  const [cartaMovimientoActualIndex, setCartaMovimientoActualIndex] = useState({});

  const [cantidadCartasMovimientoJugadorActual, setCantidadCartasMovimientoJugadorActual] = useState(null);

  const [cartasDelJugador, setCartasDelJugador] = useState(sessionStorage.getItem("cartas_mov") ? JSON.parse(sessionStorage.getItem("cartas_mov")) : [-1,-1,-1]);

  const [mazo, setMazo] = useState([]);

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
        seleccionada,
        setSeleccionada,
        jugadorActualId,
        setJugadorActualId,
        cartaMovimientoActualId,
        setCartaMovimientoActualId,
        cartaMovimientoActualIndex,
        setCartaMovimientoActualIndex,
        cantidadCartasMovimientoJugadorActual,
        setCantidadCartasMovimientoJugadorActual,
        cartasDelJugador,
        setCartasDelJugador,
        mazo,
        setMazo,
        cancelarHabilitado,
        setCancelarHabilitado,
        colorBloqueado
      }}
    >
      {children}
    </PartidaContext.Provider>
  );
};
