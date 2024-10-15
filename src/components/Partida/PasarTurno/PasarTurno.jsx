import React, { useEffect, useState } from "react";
import './PasarTurno.css';

function PasarTurno({
  jugadorActual,
  jugadores,
  onTurnoCambiado,
  tiempoLimite,
  setTimeLeft,
}) {
  const [jugadorActivo, setJugadorActivo] = useState(jugadorActual || {});
  const [partidaId, setPartidaId] = useState(null);

  useEffect(() => {
    // Obtener el ID de la partida del localStorage
    const id = sessionStorage.getItem('partida_id');
    if (id) {
      setPartidaId(id);
    } else {
      console.error("partidaId no está definido en localStorage");
    }
  }, []);

  const pasarTurno = async () => {
    // Validar que jugadorActual no sea undefined
    if (!jugadorActual || !jugadorActual.id) {
      console.error("jugadorActual no está definido correctamente");
      return;
    }
    
    const id = sessionStorage.getItem('partida_id');
    // Validar que partidaId esté definido
    if (!id) {
      console.error("partidaId no está definido");
      return;
    }
  
    // Reiniciar el temporizador antes de cambiar el turno
    setTimeLeft(tiempoLimite);
  
    // Enviar actualización del turno al backend
    try {
      const response = await fetch(`https://httpbin.org/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: jugadorActual.identifier, // Validar que jugadorActual tiene un id
        }),
      });
  
      // Loguear la respuesta completa
      const responseData = await response.json();
      console.log("Response data:", responseData);
  
      if (!response.ok) {
        throw new Error(`Error al pasar el turno: ${response.status} - ${responseData.detail}`);
      }
  
      // Actualizar el turno en la UI
      onTurnoCambiado();
    } catch (error) {
      console.error("Error en la conexión al servidor:", error);
    }
  };
  

  useEffect(() => {
    // Validar que jugadorActual esté definido antes de usarlo
    if (jugadorActual) {
      setJugadorActivo(jugadorActual);
    } else {
      console.warn("jugadorActual no está definido en el useEffect");
    }
  }, [jugadorActual]);

  return (
    <button
      onClick={pasarTurno}
      disabled={!jugadorActual || jugadorActual.id !== jugadorActivo.id} // Deshabilitar si no es el turno del jugador o si jugadorActual es undefined
      className={`boton ${(!jugadorActual || jugadorActual.id !== jugadorActivo.id) ? "botonDeshabilitado" : ""}`}
    >
      Terminar Turno
    </button>
  );
}

export default PasarTurno;
