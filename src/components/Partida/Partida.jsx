import React, { useEffect, useState } from "react";
import styles from "./Partida.module.css";
import Tablero_Container from "./tablero/tablero_container";

const Partida = () => {
  const tiempoLimite = 120; // 2 minutos
  const [jugadores] = useState(["ely", "max", "jane", "ema"]); // Array de jugadores
  const [jugadorActualIndex, setJugadorActualIndex] = useState(() => {
    const storedIndex = localStorage.getItem("jugadorActualIndex");
    return storedIndex !== null ? Number(storedIndex) : 0;
  });

  const jugadorActual = jugadores[jugadorActualIndex]; // Obtener el jugador actual
  const [timeLeft, setTimeLeft] = useState(tiempoLimite); // Estado del temporizador
  
  const manejarFinTurno = async () => {
    const nuevoIndex = (jugadorActualIndex + 1) % jugadores.length;
    setJugadorActualIndex(nuevoIndex);
    localStorage.setItem("jugadorActualIndex", nuevoIndex); // Guarda el nuevo índice en localStorage
    setTimeLeft(tiempoLimite); // Reiniciar el temporizador

    // Enviar actualización del turno al backend
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

  return (
    <div className={styles.partidaContainer}>
      <div className={styles.tableroContainer}>
        <Tablero_Container jugadores={jugadores} />
      </div>
    </div>
  );
};

export default Partida;
