import React, { useEffect, useState } from "react";
import "./PasarTurno.css";

function PasarTurno({
  jugadorActual,
  jugadores,
  onTurnoCambiado,
  tiempoLimite,
  setTimeLeft,
}) {
  const [jugadorActivo, setJugadorActivo] = useState(jugadorActual || {});

  const [partidaId, setPartidaId] = useState(null);
  const [websocket, setWebSocket] = useState(null);


  useEffect(() => {
    // Obtener el ID de la partida desde el sessionStorage
    const id = sessionStorage.getItem("partida_id");
    if (id) {
      setPartidaId(id);
    } else {
      console.error("partidaId no está definido en sessionStorage");
    }
  }, []);

  // Crear el WebSocket y escuchar los cambios de turno
  useEffect(() => {
    if (partidaId && jugadorActual) {
      const player_id = parseInt(sessionStorage.getItem("player_id"), 10);
      const ws = new WebSocket(`ws://localhost:8000/ws/lobby/${partidaId}/turns?player_id=${jugadorActual.player_id}`);

      // Guardar la instancia del WebSocket
      setWebSocket(ws);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Turno recibido:", data);

        // Actualizar la UI cuando el turno cambie
        if (data.current_turn) {
          onTurnoCambiado(data);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket cerrado");
      };

      return () => {
        ws.close(); // Cerrar WebSocket al desmontar el componente
      };
    }
  }, [partidaId, jugadorActual, onTurnoCambiado]);

  const pasarTurno = async () => {
    // Validar que jugadorActual no sea undefined
    if (!jugadorActual || !jugadorActual.player_id) {
      console.error("jugadorActual no está definido correctamente");
      return;
    }

    // Reiniciar el temporizador antes de cambiar el turno
    setTimeLeft(tiempoLimite);

    // Enviar actualización del turno al backend
    try {
      const response = await fetch(`http://localhost:8000/api/lobby/${partidaId}/advance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: jugadorActual.identifier, 
        }),
      });

      const responseData = await response.json();
      console.log("Turno actualizado:", responseData);

      if (!response.ok) {
        throw new Error(`Error al pasar el turno: ${response.status} - ${responseData.detail}`);
      }
    } catch (error) {
      console.error("Error en la conexión al servidor:", error);
    }
  };

  return (
    <button
    onClick={pasarTurno}
    disabled={!jugadorActual || jugadorActual.player_id !== jugadorActivo.player_id} // Deshabilitar si no es el turno del jugador o si jugadorActual es undefined
    className={`boton ${(!jugadorActual || jugadorActual.id !== jugadorActivo.id) ? "botonDeshabilitado" : ""}`}
  >
    Terminar Turno
  </button>
  );
}

export default PasarTurno;
