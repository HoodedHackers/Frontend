import React, { useState, useEffect, useContext, createContext } from 'react';
import CartaMovimiento from './CartaMovimiento.jsx';
import { PartidaContext } from '../PartidaProvider.jsx';
import './CartasMovimientoMano.css';

export const CartasMovimientoContext = createContext();

export const CartasMovimientoMano = ({ ubicacion, onMouseEnter, onMouseLeave }) => {
  const [seleccionada, setSeleccionada] = useState(null);
  const { jugadores, partidaIniciada } = useContext(PartidaContext);
  
  const setearCartaMovimientos = (jugadores, dataMovimientos = null) => {
    return jugadores.map((jugador, index) => {
      if (index === 0 && dataMovimientos && partidaIniciada) {
        return {
          player: jugador.id,
          cards_out: dataMovimientos.cards_out,
        };
      } else {
        return {
          player: jugador.id,
          cards_out: [
            { card_id: -1, card_name: "Soy Movimiento" },
            { card_id: -1, card_name: "Soy Movimiento" },
            { card_id: -1, card_name: "Soy Movimiento" }
          ]
        };
      }
    });
  }
  
  const [cartaMovimientos, setCartaMovimientos] = useState(() => setearCartaMovimientos(jugadores));

  useEffect(() => {
    const cargarMovimientos = async () => {
      const dataMovimientos = await obtenerMovimientos();
      setCartaMovimientos(setearCartaMovimientos(jugadores, dataMovimientos));
    };

    cargarMovimientos();
  }, [jugadores, partidaIniciada]);

  async function obtenerMovimientos() {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/partida/en_curso', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          game_id: Number(sessionStorage.getItem('partida_id')),
          players: jugadores
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

  const descartarCarta = async (carta, completamente) => {
    const action = completamente ? 'descartar_totalmente' : 'descartar_parcialmente';
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/partida/${action}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          game_id: Number(sessionStorage.getItem('partida_id')),
          carta_id: carta.card_id,
          player_id: jugadores[ubicacion].id,
        })
      });

      if (!response.ok) {
        throw new Error('Fallo al intentar descartar la carta');
      }

      setCartaMovimientos((prev) => {
        const nuevoEstado = [...prev];
        const jugadorIndex = nuevoEstado[ubicacion];
        jugadorIndex.cards_out = jugadorIndex.cards_out.filter(c => c.card_id !== carta.card_id);
        return nuevoEstado;
      });

    } catch (error) {
      console.error(error);
      alert("Error al intentar descartar la carta. Inténtalo de nuevo.");
    }
  };

  const cartasDelJugador = cartaMovimientos[ubicacion]?.cards_out || [];

  useEffect(() => {
    const dropArea = document.getElementById('drop-area');
    if (dropArea) {
      dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('drag-over');
      });

      dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('drag-over');
      });

      dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('drag-over');

        const cartaId = e.dataTransfer.getData('text/plain');
        console.log(`Carta soltada: ${cartaId}`);
      });
    }
  }, []);

  return (
    <CartasMovimientoContext.Provider 
      value={{
        seleccionada,
        setSeleccionada,
        descartarCarta
      }}
    >  
      <div className={`jugador${ubicacion + 1}-container-cartas-movimiento`}>
        {cartasDelJugador.length > 0 ? (
          cartasDelJugador.map((carta, index) => (
            <div key={index}>
              <CartaMovimiento
                id={carta.card_id} 
                ubicacion={ubicacion}
                onDescartar={(completamente) => descartarCarta(carta, completamente)}
              />
            </div>
          ))
        ) : (
          <p>No hay cartas disponibles.</p> 
        )}

        <div id="drop-area" style={{ width: '80%', height: '50px', border: '2px dashed red', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }}>
          <p>descarte</p>
        </div>
      </div>
    </CartasMovimientoContext.Provider>
  );
};

// HARDCODEADO
/*import React, { useState, useEffect, useContext, createContext } from 'react';
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
          player: jugador.id,
          cards_out: dataMovimientos.cards_out, // Usa los datos recibidos
        };
      } else {
        // Para el resto de los jugadores
        return {
          player: jugador.id,
          cards_out: [
            { card_id: -1, card_name: "Soy Movimiento" },
            { card_id: -1, card_name: "Soy Movimiento" },
            { card_id: -1, card_name: "Soy Movimiento" }
          ]
        };
      }
    });
  }
  
  const [cartaMovimientos, setCartaMovimientos] = useState(() => setearCartaMovimientos(jugadores));

  // Actualiza las cartas de movimiento cuando los jugadores cambian
  useEffect(() => {
    // Obtener los movimientos para el primer jugador
    const cargarMovimientos = async () => {
      const dataMovimientos = await obtenerMovimientos();
      setCartaMovimientos(setearCartaMovimientos(jugadores, dataMovimientos));
    };

    cargarMovimientos();
  }, [jugadores, partidaIniciada]);


  async function obtenerMovimientos () {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/partida/en_curso', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          game_id: Number(sessionStorage.getItem('partida_id')),
          players: jugadores
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
  const cartasDelJugador = cartaMovimientos[ubicacion]?.cards_out || [];

  

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
                  id={carta.card_id} 
                  ubicacion={ubicacion}
                  activa={false}
                />
              </div>
            ) : (
              <div 
                key={index}
              >
                <CartaMovimiento
                  id={carta.card_id} 
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
};*/
