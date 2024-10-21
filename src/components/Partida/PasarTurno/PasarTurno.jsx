import React, { useContext, useEffect, useState } from "react";
import "./PasarTurno.css";
import { PartidaContext } from '../PartidaProvider.jsx';

const PasarTurno = ({ tiempoLimite, setTimeLeft }) => {
  const { turnoActual, jugadorActual } = useContext(PartidaContext);
  const [disabled, setDisabled] = useState(true);

  const identifier = sessionStorage.getItem("identifier");
  const game_id = sessionStorage.getItem("partida_id");

  useEffect(() => {
    // Si es el turno del jugador actual, habilita el botón
    if (turnoActual === jugadorActual) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [turnoActual, jugadorActual]);

  const pasarTurno = async () => {
    // Reiniciar el temporizador antes de cambiar el turno
    setTimeLeft(tiempoLimite);

    try {
      const response = await fetch(`http://localhost:8000/api/lobby/${game_id}/advance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifier,
        }),
      });

      const responseData = await response.json();
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
      disabled={disabled}
      className={`boton ${disabled ? "botonDeshabilitado" : ""}`}
    >
      Terminar Turno
    </button>
  );
};

export default PasarTurno;
