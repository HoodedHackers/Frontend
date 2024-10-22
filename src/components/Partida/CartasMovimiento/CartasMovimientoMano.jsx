import React, { useState, useEffect, useContext, createContext } from 'react';
import CartaMovimiento from './CartaMovimiento.jsx';
import { PartidaContext } from '../PartidaProvider.jsx';
import './CartasMovimientoMano.css';

export const CartasMovimientoContext = createContext();

export const CartasMovimientoMano = ({ubicacion, jugadorId}) => {
  const [seleccionada, setSeleccionada] = useState(null);
  const [cartasDelJugador, setCartasDelJugador] = useState([]);
  const {
    partidaIniciada,
    jugadorActualId, 
    cartaMovimientoActualId, 
    cartaMovimientoActualIndex ,
    cantidadCartasMovimientoJugadorActual
  } = useContext(PartidaContext);


  // Actualiza las cartas de movimiento al comenzar la partida
  useEffect(() => {
    if (partidaIniciada) {
      const cargarMovimientos = async () => {
        const dataMovimientos = await obtenerMovimientos();
        setCartasDelJugador(dataMovimientos.all_cards);
      };
      cargarMovimientos();
    }
    else {
      setCartasDelJugador([-1,-1,-1]);
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
              ((index + 1) <= cantidadCartasMovimientoJugadorActual) || cantidadCartasMovimientoJugadorActual === null ? (
                <div key={index}>
                  <CartaMovimiento
                    id={carta} 
                    ubicacion={ubicacion}
                    index={index}
                  />
                </div>
              ) : (
                null
              )
            ) : (
              jugadorId === jugadorActualId ? (
                cartaMovimientoActualIndex === index ? (
                  <div key={index}>
                    <CartaMovimiento
                      id={cartaMovimientoActualId} 
                      ubicacion={ubicacion}
                      index={index}
                    />
                  </div>
                ) : (
                  (index + 1) <= cantidadCartasMovimientoJugadorActual ? (
                    <div key={index}>
                      <CartaMovimiento
                        id={-1} 
                        ubicacion={ubicacion}
                        index={index}
                      />
                    </div>
                  ) : (
                    null
                  )
                )
              ) : (
                <div key={index}>
                  <CartaMovimiento
                    id={-1} 
                    ubicacion={ubicacion}
                    index={index}
                  />
                </div>
              )
            )
          ))
        ) : (
          null
        )}
      </div>
    </CartasMovimientoContext.Provider>
  );
};
