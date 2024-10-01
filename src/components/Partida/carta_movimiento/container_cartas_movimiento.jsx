import React from 'react';
import CartaMovimiento from './carta_movimiento.jsx';
import './container_cartas_movimiento.css';

const ContainerCartasMovimiento = ({ubicacion, onMouseEnter, onMouseLeave}) => {
  const [cartaMovimientos, setCartaMovimientos] = React.useState([
    { player: 1, cards_out: [{ card_id: 30, card_name: "Soy Movimiento" },
      { card_id: 21, card_name: "Soy Movimiento" },
      { card_id: 42, card_name: "Soy Movimiento" }] 
    },
    { player: 2, cards_out: [{ card_id: 31, card_name: "Soy Movimiento" },
      { card_id: 22, card_name: "Soy Movimiento" },
      { card_id: 43, card_name: "Soy Movimiento" }] 
    },
    { player: 3, cards_out: [{ card_id: 32, card_name: "Soy Movimiento" }, 
      { card_id: 23, card_name: "Soy Movimiento" }, 
      { card_id: 44, card_name: "Soy Movimiento" }] 
    },
    { player: 4, cards_out: [{ card_id: 33, card_name: "Soy Movimiento" }, 
      { card_id: 24, card_name: "Soy Movimiento" },
      { card_id: 45, card_name: "Soy Movimiento" }] 
    },
  ]);

  // Verifica si cartaMovimientos tiene el jugador en la ubicación y si tiene cartas
  const cartasDelJugador = cartaMovimientos[ubicacion]?.cards_out || [];

  return (
    <div className={`jugador${ubicacion + 1}-container-cartas-movimiento`}>
      {cartasDelJugador.length > 0 ? (
        cartasDelJugador.map((carta) => (
          <div key={carta.card_id} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <CartaMovimiento tipo={(carta.card_id % 7) + 1} />
          </div>
        ))
      ) : (
        null
      )}
    </div>
  );
};

export default ContainerCartasMovimiento;
