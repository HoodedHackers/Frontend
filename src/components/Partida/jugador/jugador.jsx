import React from "react";
import './Jugador.css';

function Jugador({nombre, ubicacion}) {

  return (
    <div className={ubicacion}>
        <p className="jugador" >{nombre}</p>
    </div>
    );
}

export default Jugador;
