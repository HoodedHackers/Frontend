import React, { useEffect, useState } from "react";
import styles from "./PasarTurno.module.css"; 

const BotonPasarTurno = ({
  jugadorActual,
  jugadores,
  onTurnoCambiado,
  tiempoLimite,
  setTimeLeft,
}) => {
  const [jugadorActivo, setJugadorActivo] = useState(jugadorActual);
  const pasarTurno = async () => {
    const indiceSiguienteJugador = (jugadores.indexOf(jugadorActivo) + 1) % jugadores.length;
    const siguienteJugador = jugadores[indiceSiguienteJugador];
  
    // Actualizar el estado local del jugador activo
    setJugadorActivo(siguienteJugador);
  
    // Reiniciar el temporizador antes de enviar al servidor
    setTimeLeft(tiempoLimite); // Reiniciar el temporizador a su valor original
    localStorage.setItem("timeLeft", tiempoLimite); // Actualiza el localStorage
  
    // Enviar actualización del turno al backend
    try {
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jugadorActualIndex: indiceSiguienteJugador }),
      });
  
      if (!response.ok) {
        throw new Error("Error al pasar el turno");
      }
  
      // Llamar a la función para actualizar el turno en la UI principal
      onTurnoCambiado(); // Esto debe llamar a la función de cambio de turno en Partida
    } catch (error) {
      console.error("Error en la conexión al servidor:", error);
    }
  };
  
  

  useEffect(() => {
    // Actualizar el estado cuando cambie el jugador actual desde fuera
    setJugadorActivo(jugadorActual);
  }, [jugadorActual]);

  return (
    <div className={styles.botonContainer}>
      <button
        onClick={pasarTurno}
        disabled={jugadorActual !== jugadorActivo}
        className={`${styles.boton} ${jugadorActual !== jugadorActivo ? styles.botonDeshabilitado : ""}`}
      >
        Terminar Turno
      </button>
    </div>
  );
};

export default BotonPasarTurno;
