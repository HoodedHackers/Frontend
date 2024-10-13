import React, { useState, useContext } from 'react';
import { PartidaContext } from '../PartidaProvider.jsx';
import { CartasMovimientoContext } from './CartasMovimientoMano.jsx';
import { WebSocketContext } from '../../WebSocketsProvider.jsx';
import './CartaMovimiento.css';

const CartaMovimiento = ({id, ubicacion}) => {
  const Images = [
    "/Imagenes/Movimiento/back-mov.svg",
    "/Imagenes/Movimiento/mov1.svg",
    "/Imagenes/Movimiento/mov2.svg",
    "/Imagenes/Movimiento/mov3.svg",
    "/Imagenes/Movimiento/mov4.svg",
    "/Imagenes/Movimiento/mov5.svg",
    "/Imagenes/Movimiento/mov6.svg",
    "/Imagenes/Movimiento/mov7.svg"
  ]

  const [isActive , setIsActive] = useState(false);

  const { jugando, setJugando, handleMouseEnter, handleMouseLeave } = useContext(PartidaContext);

  const { seleccionada, setSeleccionada } = useContext(CartasMovimientoContext);

  const { wsUCMRef } = useContext(WebSocketContext);

  const usarCartaMovimiento = () => {
    if (!jugando || seleccionada === id || seleccionada === null) {
      try {
        // Conectar al WebSocket de Usar Carta de Movimiento
        wsUCMRef.current = new WebSocket("ws://localhost:8000/ws/ucm");
      
        // Manejar la conexión abierta
        wsUCMRef.current.onopen = () => {
          console.log("Conexión WebSocket de Usar Carta de Movimiento abierta.");
        
          const message = {
            user_identifier: sessionStorage.getItem('identifier'),
            card_id: id
          };
          wsUCMRef.current.send(JSON.stringify(message));
          console.log("Se envió la Carta de Movimiento elegida.");
        };
      
        // Manejar errores
        wsUCMRef.current.onerror = (error) => {
          throw new Error("Error en WebSocket de Usar Carta de Movimiento: ", error);
        };
      
        setIsActive(!isActive);
        setSeleccionada(id);
        setJugando(!jugando);
      } catch (error) {
        console.error(error);
      }
    } 
  }

  return (
      ubicacion === 0 ? (
        <div 
          className={`carta-movimiento ${isActive ? 'activa' : ''}`}
          onClick={usarCartaMovimiento}
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
        >
          <img src={Images[(id % 7) + 1]} alt={`Carta de Movimiento ${(id % 7) + 1}`} className='carta-movimiento-img'/>
        </div>
      ) : (
        <div className={"carta-movimiento-sin-hover"}>
          <img src={Images[(id % 7) + 1]} alt={`Carta de Movimiento ${(id % 7) + 1}`} className='carta-movimiento-img'/>
        </div>
      ) 
  );
};

export default CartaMovimiento;
