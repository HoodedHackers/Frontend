import React, { useEffect, useContext, useRef } from 'react';
import CartaFigura from './CartaFigura'; 
import { PartidaContext } from '../PartidaProvider.jsx';
import './MazoCartaFigura.css'; 
import { WebSocketContext } from '../../WebSocketsProvider.jsx';

function MazoCartaFigura ({ubicacion}) {
  const { handleMouseEnter, handleMouseLeave, partidaIniciada, mazo } = useContext(PartidaContext);
  const { wsCFRef } = useContext(WebSocketContext);
  const playerId = sessionStorage.getItem('player_id');
  const partidaId = sessionStorage.getItem('partida_id');

  useEffect(() => {
    if (partidaIniciada) {   
      // Manejar la apertura de la conexión WebSocket
      wsCFRef.current.send(JSON.stringify({ receive: 'cards'}));
    }
  }, [partidaIniciada]);

  console.log(mazo);
  const cartasDelJugador = mazo[ubicacion]?.cards || [];


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