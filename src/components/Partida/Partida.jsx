import React, { useState, useEffect } from "react";
import TurnoTemporizador from "../Temporizador/TurnoTemporizador";
import PasarTurno from "../PasarTurno/PasarTurno";
import styles from "./Partida.module.css";

const Partida = () => {
  const tiempoLimite = 120; // 2 minutos
  const [jugadores, setJugadores] = useState(() => {
    const storedJugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
    return storedJugadores.length > 0 ? storedJugadores : ["Jugador1", "Jugador2", "Jugador3", "Jugador4"]; // Default names
  });

  const [jugadorActualIndex, setJugadorActualIndex] = useState(() => {
    const storedIndex = localStorage.getItem("jugadorActualIndex");
    return storedIndex !== null ? parseInt(storedIndex) : 0;
  });

  const [tiempoRestante, setTiempoRestante] = useState(() => {
    const storedTiempo = localStorage.getItem("tiempoRestante");
    return storedTiempo !== null ? parseInt(storedTiempo) : tiempoLimite;
  });

   // Recuperar el nickname del localStorage
   const nickname = localStorage.getItem("nickname") || "Jugador1";

  // Guardar el estado en localStorage
  useEffect(() => {
    localStorage.setItem("jugadorActualIndex", jugadorActualIndex);
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
    localStorage.setItem("tiempoRestante", tiempoRestante);
  }, [jugadorActualIndex, jugadores, tiempoRestante]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTiempoRestante((prevTiempo) => {
        if (prevTiempo > 0) {
          return prevTiempo - 1;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pasarTurno = () => {
    setJugadorActualIndex((prevIndex) => (prevIndex + 1) % jugadores.length); // Cambia de jugador circularmente
    setTiempoRestante(tiempoLimite); // Reinicia el temporizador
  };

  const jugadorActual = jugadores[jugadorActualIndex]; // Obtiene el nombre del jugador actual

  return (
    <div className={styles.partidaContainer}>
      <TurnoTemporizador
        tiempoLimite={tiempoRestante}
        jugadorActual={nickname} // Muestra el nombre del jugador actual
        jugadoresEnPartida={jugadores.length} // Pasa la cantidad de jugadores
        resetTimer={pasarTurno} // Pasa la función para reiniciar el temporizador
      />
      <PasarTurno onPasarTurno={pasarTurno} />
    </div>
  );
};

export default Partida;


