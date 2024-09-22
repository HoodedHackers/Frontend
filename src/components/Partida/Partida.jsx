import React from "react";
import TurnoTemporizador from "../Temporizador/TurnoTemporizador";
import styles from "./Partida.module.css"; 

const Partida = () => {
  const tiempoLimite = 120; // 2 minutos
  const jugadorActual = "Jugador 1"; // Cambia esto según tu lógica de jugadores
  const jugadoresEnPartida = 2; // Cambia esto según la cantidad de jugadores

  return (
    <div className={styles.partidaContainer}>
      <TurnoTemporizador 
        tiempoLimite={tiempoLimite} 
        jugadorActual={jugadorActual} 
        jugadoresEnPartida={jugadoresEnPartida} 
      />
    </div>
  );
};

export default Partida;
