import React from "react";
import Jugador from "./jugador/jugador.jsx";
import "./Partida.css";

function Partida() {
  const [jugadores, setJugadores] = React.useState([]);
  //useState([
  //  { id: 1, name: "Jugador 1" },
  //  { id: 2, name: "Jugador 2" },
  //  { id: 3, name: "Jugador 3" },
  //  { id: 4, name: "Jugador 4" }
  //]);

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