import React, { useEffect, useState } from "react";
import styles from "./pasar_turno.module.css"; 

function Pasar_Turno  ({
  jugadorActual,
  jugadores,
  onTurnoCambiado,
  tiempoLimite,
  setTimeLeft,
}) {
  const [jugadorActivo, setJugadorActivo] = useState(jugadorActual);

  const pasarTurno = async () => {
    // Reiniciar el temporizador antes de cambiar el turno
    setTimeLeft(tiempoLimite);
  
    // Determinar el siguiente jugador en la lista
    const indiceSiguienteJugador =
      (jugadores.indexOf(jugadorActivo) + 1) % jugadores.length;
    const siguienteJugador = jugadores[indiceSiguienteJugador];
  
    // Actualizar el estado local del jugador activo
    setJugadorActivo(siguienteJugador);
  
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
      onTurnoCambiado();
    } catch (error) {
      console.error("Error en la conexión al servidor:", error);
    }
  };

  useEffect(() => {
    // Actualizar el estado cuando cambie el jugador actual desde fuera
    setJugadorActivo(jugadorActual);
  }, [jugadorActual]);

  return (
    <button
      onClick={pasarTurno}
      disabled={jugadorActual !== jugadorActivo}
      className={`${styles.boton} ${jugadorActual !== jugadorActivo ? styles.botonDeshabilitado : ""}`}
    >
      Terminar Turno
    </button>
  );
};

export default Pasar_Turno;
