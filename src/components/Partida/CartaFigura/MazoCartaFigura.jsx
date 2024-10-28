import React, { useEffect, useContext } from 'react';
import CartaFigura from './CartaFigura'; 
import { PartidaContext } from '../PartidaProvider.jsx';
import './MazoCartaFigura.css'; 

function MazoCartaFigura ({ubicacion}) { 
  const { handleMouseEnter, handleMouseLeave, mazo, jugadores } = useContext(PartidaContext);
  
  // Funcion que ordena y filtra lo jugadores segun su id
  function ordenarPlayers(dataPlayers, jugadores) {
    // Obtenemos el orden de player_id desde jugadores
    const ordenJugadorIds = jugadores.map(jugador => jugador.player_id);
  
    // Filtramos dataPlayers para eliminar elementos no presentes en jugadores
    const jugadoresFiltrados = dataPlayers.filter(jugador =>
      ordenJugadorIds.includes(jugador.player_id)
    );
  
    // Ordenamos jugadoresFiltrados según el orden de jugadores
    const jugadoresOrdenados = jugadoresFiltrados.sort((a, b) => {
      return ordenJugadorIds.indexOf(a.player_id) - ordenJugadorIds.indexOf(b.player_id);
    });
  
    return jugadoresOrdenados;
  }
  
  console.log("MazoCartaFigura.jsx: mazo: ", mazo);
  const mazoo = ordenarPlayers(mazo, jugadores);
  const cartasDelJugador = mazoo[ubicacion]?.cards || [];;

  return (
    <div className={`container-cartas-figura grupo-${ubicacion + 1}`}>
      {cartasDelJugador.length > 0 ? (
        cartasDelJugador.map((carta) => (
          <div key={carta} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <CartaFigura tipo={(carta % 25) + 1} />
          </div>
        ))
      ) : (
        null
      )}
    </div>
  );
};

export default MazoCartaFigura;