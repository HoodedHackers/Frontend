import React, { useEffect } from "react";
import Jugador from "./jugador/jugador.jsx";
import ContainerCartasMovimiento from "./carta_movimiento/container_cartas_movimiento.jsx";
import TurnoTemporizador from "./temporizador/temporizador.jsx";
import "./Partida.css"; 

function Partida() {
  const tiempoLimite = 120; // 2 minutos
  const [jugadores, setJugadores] = React.useState([
    //{ id: 1, name: "Jugador1" },
    //{ id: 2, name: "Jugador2" },
    //{ id: 3, name: "Jugador3" },
    //{ id: 4, name: "Jugador4" }
  ]);

  const [jugadorActualIndex, setJugadorActualIndex] = React.useState(() => {
    const storedIndex = localStorage.getItem("jugadorActualIndex");
    return storedIndex !== null ? Number(storedIndex) : 0;
  });

  const jugadorActual = jugadores[jugadorActualIndex]; // Obtener el jugador actual
  const [timeLeft, setTimeLeft] = React.useState(tiempoLimite); // Estado del temporizador
  
  // Estado para manejar si el overlay debe mostrarse
  const [isOverlayVisible, setIsOverlayVisible] = React.useState(false);
  
  // Funciones para manejar el mouse sobre las cartas
  const handleMouseEnter = () => {
    setIsOverlayVisible(true);
  };
  
  const handleMouseLeave = () => {
    setIsOverlayVisible(false);
  };

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
    <div>
      {jugadores.map((jugador, index) => (
        <div key={jugador.id}>
          <Jugador nombre={jugador.name} ubicacion={`jugador${index + 1}`} />
          <ContainerCartasMovimiento
            ubicacion={index}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave} />
        </div>
      ))}
      <div className="container-partida">
        <TurnoTemporizador 
          tiempoLimite={tiempoLimite} 
          jugadorActual={jugadores[0].name} 
          jugadoresEnPartida={jugadores.length} 
        />
      </div>
      {isOverlayVisible && <div className="overlay"></div>}
    </div>
  );
}

export default Partida;
