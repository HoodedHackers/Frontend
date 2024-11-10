import React, { useContext } from 'react';
import CartaMovimiento from './CartaMovimiento.jsx';
import { PartidaContext } from '../PartidaProvider.jsx';
import './CartasMovimientoMano.css';

export const CartasMovimientoMano = ({ubicacion, jugadorId}) => {
  const cartasDefault = [-1, -1, -1];
  const {
    jugadorActualId, 
    cartaMovimientoActualId, 
    cartaMovimientoActualIndex ,
    cantidadCartasMovimientoJugadorActual,
    cartasDelJugador,
    partidaIniciada
  } = useContext(PartidaContext);


  return (
    <div className={`jugador${ubicacion + 1}-container-cartas-movimiento`}>
      {ubicacion === 0 && partidaIniciada ? (
        cartasDelJugador.length > 0 ? (
          cartasDelJugador.map((carta, index) => (
              <div key={index}>
                <CartaMovimiento
                  id={carta} 
                  ubicacion={ubicacion}
                  index={index}
                />
              </div>
          ))
        ) : (
          null
        )
      ) : (
        cartasDefault.map((carta, index) =>
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
                    id={carta} 
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
                id={carta} 
                ubicacion={ubicacion}
                index={index}
              />
            </div>
          )
        )
      )}
    </div>
  );
};
