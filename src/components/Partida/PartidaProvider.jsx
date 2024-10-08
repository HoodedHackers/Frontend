import React, { createContext, useState, useEffect } from 'react';

export const PartidaContext = createContext();

export const PartidaProvider = ({ children }) => {
  const [partidaIniciada, setPartidaIniciada] = useState(sessionStorage.getItem("partidaIniciada") === "true" || false);

  const tiempoLimite = 120; // 2 minutos

  const [jugadores, setJugadores] = useState([
    { id: 1, name: "Jugador 1" },
    { id: 2, name: "Jugador 2" },
    { id: 3, name: "Jugador 3" },
    { id: 4, name: "Jugador 4" }
  ]);

  const [jugadorActualIndex, setJugadorActualIndex] = useState(() => {
    const storedIndex = localStorage.getItem("jugadorActualIndex");
    return storedIndex !== null ? Number(storedIndex) : 0;
  });

  const jugadorActual = jugadores[jugadorActualIndex];

  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTime = localStorage.getItem("timeLeft");
    return storedTime !== null ? Number(storedTime) : tiempoLimite;
  });

  const manejarFinTurno = async () => {
    const nuevoIndex = (jugadorActualIndex + 1) % jugadores.length;
    setJugadorActualIndex(nuevoIndex);
    localStorage.setItem("jugadorActualIndex", nuevoIndex);
    setTimeLeft(tiempoLimite);
    localStorage.setItem("timeLeft", tiempoLimite);

    try {
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jugadorActualIndex: nuevoIndex }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el turno en el servidor");
      }
    } catch (error) {
      console.error("Error en la conexión al servidor:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("timeLeft", timeLeft);
  }, [timeLeft]);

  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const handleMouseEnter = () => setIsOverlayVisible(true);
  const handleMouseLeave = () => setIsOverlayVisible(false);

  return (
    <PartidaContext.Provider
      value={{
        partidaIniciada,
        setPartidaIniciada,
        tiempoLimite,
        jugadores,
        jugadorActual,
        jugadorActualIndex,
        setJugadorActualIndex,
        timeLeft,
        setTimeLeft,
        manejarFinTurno,
        isOverlayVisible,
        handleMouseEnter,
        handleMouseLeave
      }}
    >
      {children}
    </PartidaContext.Provider>
  );
};
