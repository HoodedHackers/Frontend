import React, { useState, useEffect, useContext, createContext } from 'react';
import CartaMovimiento from './CartaMovimiento.jsx';
import { PartidaContext } from '../PartidaProvider.jsx';
import './CartasMovimientoMano.css';

export const CartasMovimientoContext = createContext();

export const CartasMovimientoMano = ({ubicacion, onMouseEnter, onMouseLeave}) => {
  const [seleccionada, setSeleccionada] = useState(null);
  const { jugadores, partidaIniciada } = useContext(PartidaContext);

  const setearCartaMovimientos = (jugadores, dataMovimientos = null) => {
    return jugadores.map((jugador, index) => {
      if (index === 0 && dataMovimientos && partidaIniciada) {
        // Si es el primer jugador y los datos de movimientos están disponibles
        return {
          player_id: jugador.player_id,
          all_cards: dataMovimientos.all_cards, // Usa los datos recibidos
        };
      } else {
        // Para el resto de los jugadores
        return {
          player_id: jugador.player_id,
          all_cards: [-1, -1, -1]
        };
      }
    });
  }
  
  const [cartaMovimientos, setCartaMovimientos] = useState(() => setearCartaMovimientos(jugadores));

  // Actualiza las cartas de movimiento cuando los jugadores cambian
  useEffect(() => {
    if (partidaIniciada) {
      // Obtener los movimientos para el primer jugador
      const cargarMovimientos = async () => {
      const dataMovimientos = await obtenerMovimientos();
      setCartaMovimientos(setearCartaMovimientos(jugadores, dataMovimientos));
      };
      cargarMovimientos();
    }
  }, [partidaIniciada]);


  async function obtenerMovimientos () {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/partida/en_curso/movimiento', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          game_id: parseInt(sessionStorage.getItem("partida_id"), 10),
          player: sessionStorage.getItem("identifier")
        })
      });
      if (!response.ok) {
        throw new Error('Fallo al intentar recuperar los movimientos');
      }
      const data = await response.json();
      console.log("Datos de movimientos recibidos");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // Verifica si cartaMovimientos tiene el jugador en la ubicación y si tiene cartas
  const cartasDelJugador = cartaMovimientos[ubicacion]?.all_cards || [];

  

  return (
    <CartasMovimientoContext.Provider 
      value={{
        seleccionada,
        setSeleccionada
      }}
    >  
      <div className={`jugador${ubicacion + 1}-container-cartas-movimiento`}>
        {cartasDelJugador.length > 0 ? (
          cartasDelJugador.map((carta, index) => (
            ubicacion === 0 ? (
              <div key={index}>
                <CartaMovimiento
                  id={isNaN(carta) ? -1 : carta} 
                  ubicacion={ubicacion}
                  activa={false}
                />
              </div>
            ) : (
              <div 
                key={index}
              >
                <CartaMovimiento
                  id={isNaN(carta) ? -1 : carta} 
                  ubicacion={ubicacion}
                />
              </div>
            )
          ))
        ) : (
          null
        )}
      </div>
    </CartasMovimientoContext.Provider>
  );
};
