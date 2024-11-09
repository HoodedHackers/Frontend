import React, { useState, useEffect, useContext, createContext } from 'react';
import CartaMovimiento from './CartaMovimiento.jsx';
import { PartidaContext } from '../PartidaProvider.jsx';
import './CartasMovimientoMano.css';

export const CartasMovimientoContext = createContext();

export const CartasMovimientoMano = ({ubicacion, jugadorId}) => {
  const [seleccionada, setSeleccionada] = useState(null);
  const {
    jugadorActualId, 
    cartaMovimientoActualId, 
    cartaMovimientoActualIndex ,
    cantidadCartasMovimientoJugadorActual,
    cartasDelJugador
  } = useContext(PartidaContext);


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
              jugadorId === jugadorActualId ? (
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
                <div key={index}>
                  <CartaMovimiento
                    id={carta} 
                    ubicacion={ubicacion}
                    index={index}
                  />
                </div>
              ) 
            ) : (
              jugadorId === jugadorActualId ? (
                (index + 1) <= cantidadCartasMovimientoJugadorActual ? (
                  cartaMovimientoActualIndex === index ? (
                    <div key={index}>
                      <CartaMovimiento
                        id={cartaMovimientoActualId} 
                        ubicacion={ubicacion}
                        index={index}
                      />
                    </div>
                  ) : (
                    <div key={index}>
                      <CartaMovimiento
                        id={-1} 
                        ubicacion={ubicacion}
                        index={index}
                      />
                    </div>
                  )
                ) : (
                  null
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
