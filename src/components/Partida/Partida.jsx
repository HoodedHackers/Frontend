import React from "react";
import Jugador from "./jugador/jugador.jsx";
import "./Partida.css";

function Partida() {
  const [jugadores, setJugadores] = React.useState([]);

  return (
    <div>
      {jugadores.map((jugador, index) => (
        <div key={jugador.id}>
          <Jugador nombre={jugador.name} ubicacion={`jugador${index + 1}`} />
        </div>
      ))}
    </div>
  );
}

export default Partida;