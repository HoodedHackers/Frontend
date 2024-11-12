import React, { useContext } from 'react';
import CartaFigura from './CartaFigura';
import { PartidaContext } from '../PartidaProvider.jsx';
import { WebSocketContext } from '../../WebSocketsProvider.jsx';
import './MazoCartaFigura.css';

function MazoCartaFigura ({ubicacion}) {
  const {
    handleMouseEnter,
    handleMouseLeave,
    mazo,
    jugadores,
    cartasBloqueadas,
    setSeleccionadaFig,
    setJugandoFig
  } = useContext(PartidaContext);
  const { wsCRef } = useContext(WebSocketContext);
  const gameId = sessionStorage.getItem('partida_id');

  function ordenarPlayers(playerDecks, jugadores) {
    const ordenJugadorIds = jugadores.map(jugador => jugador.player_id);
    const jugadoresFiltrados = playerDecks.filter(jugador =>
      ordenJugadorIds.includes(jugador.player_id)
    );
    const jugadoresOrdenados = jugadoresFiltrados.sort((a, b) => {
      return ordenJugadorIds.indexOf(a.player_id) - ordenJugadorIds.indexOf(b.player_id);
    });
    return jugadoresOrdenados;
  };

  function obtenerPlayerIdBloqueadoPorCarta(carta, mazoOrdenado) {
    const jugadorConCarta = mazoOrdenado.find(player =>
      player.cards.includes(carta)
    );

    return jugadorConCarta ? jugadorConCarta.player_id : null;
  }

  async function handleCardClickBlock(carta, jugadorId, mazoOrdenado, color) {

    const jugadorIdBloqueado = obtenerPlayerIdBloqueadoPorCarta(carta, mazoOrdenado);

    const blockRequest = {
      identifier: sessionStorage.getItem('identifier'), // Identificador de la partida
      id_player_block: jugadorIdBloqueado, // ID del jugador objetivo que posee la carta
      id_card_block: carta, // ID de la carta que se intenta bloquear
      color: color
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/lobby/${gameId}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blockRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al bloquear la carta:', errorData.detail);
      } else {
        const data = await response.json();
        console.log('Carta bloqueada con éxito:', data);
        setSeleccionadaFig({});
        setJugandoFig(false);
        const player_name = sessionStorage.getItem("player_nickname");
        wsCRef.current.send(JSON.stringify({message: `${player_name} ha bloqueado una carta de figura.`}));
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const mazoOrdenado = ordenarPlayers(mazo, jugadores);
  const cartasJugadores = mazoOrdenado[ubicacion]?.cards || [];
  const jugadorId = mazoOrdenado[ubicacion]?.player_id;

  return (
    <div className={`container-cartas-figura grupo-${ubicacion + 1}`}>
      {cartasJugadores.map((carta) => (
        <div
        key={carta}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          if (jugadorId !== sessionStorage.getItem('player_id')) {
            handleCardClickBlock(carta, jugadorId, mazoOrdenado);
          }
        }}
        className={cartasBloqueadas.includes(carta) ? 'carta-bloqueada' : ''}
      >
        <CartaFigura tipo={(carta)} />
      </div>
      ))}
    </div>
  );
};

export default MazoCartaFigura;
