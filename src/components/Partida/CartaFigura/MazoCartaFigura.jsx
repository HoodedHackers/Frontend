import React, { useEffect, useContext, useRef } from 'react';
import CartaFigura from './CartaFigura'; 
import { PartidaContext } from '../PartidaProvider.jsx';
import './MazoCartaFigura.css'; 

function MazoCartaFigura ({ubicacion}) {
  const { handleMouseEnter, handleMouseLeave, partidaIniciada, mazo } = useContext(PartidaContext);
  const ident = sessionStorage.getItem('identifier');
  const partidaId = sessionStorage.getItem('partida_id');

  useEffect(() => {
    const fetchData = async () => {
      if (partidaIniciada) {
        const response = await fetch(`http://127.0.0.1:8000/api/lobby/${partidaId}/figs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ player_identifier: ident }),
        });
      }
    };
    fetchData();
  }, [partidaIniciada]);
  
  console.log('mazo:', mazo);
  const cartasDelJugador = /*mazo[ubicacion]?.cards ||*/ [];

  return (
    <div className={`container-cartas-figura grupo-${ubicacion + 1}`}>
      {cartasDelJugador.length > 0 ? (
        cartasDelJugador.map((cartaId, index) => (
          <div key={index} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <CartaFigura tipo={cartaId} /> 
          </div>
        ))
      ) : (
        null
      )}
    </div>
  );
}

export default MazoCartaFigura;