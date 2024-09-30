import React from 'react';
import './jugador.css';


// Función que divide un nombre en partes de 16 caracteres
function dividirNombre(nombre) {
  const partes = [];
  let posicion = 0;
  while (posicion < nombre.length) {
    const corte = nombre.substr(posicion, 16);
    partes.push(corte);
    posicion += 16;
  }
  
  return partes;
}


function Jugador({nombre, ubicacion}) {
  const nombreDividido = dividirNombre(nombre);

  return (
    <div className={ubicacion}>
        <p className="jugador" >{nombreDividido}</p>
    </div>
    );
}

export default Jugador;