import React from "react";
import Jugador from "./jugador/jugador.jsx";
import ContainerCartasMovimiento from "./carta_movimiento/container_cartas_movimiento.jsx";
import "./Partida.css";

function Partida() {
  const [jugadores, setJugadores] = React.useState([
    // { id: 1, name: "Jugador1" },
    // { id: 2, name: "Jugador2" },
    // { id: 3, name: "Jugador3" },
    // { id: 4, name: "Jugador4" }
  ]);

  // Estado para manejar si el overlay debe mostrarse
  const [isOverlayVisible, setIsOverlayVisible] = React.useState(false);
  
  // Funciones para manejar el mouse sobre las cartas
  const handleMouseEnter = () => {
    setIsOverlayVisible(true);
  };
  
  const handleMouseLeave = () => {
    setIsOverlayVisible(false);
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
      {isOverlayVisible && <div className="overlay"></div>}
    </div>
  );
}

export default Partida;