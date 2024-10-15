import React, { useState, useContext } from 'react';
import { PartidaContext } from '../PartidaProvider.jsx';
import { CartasMovimientoContext } from './CartasMovimientoMano.jsx';
import { WebSocketContext } from '../../WebSocketsProvider.jsx';
import './CartaMovimiento.css';

const CartaMovimiento = ({ id, ubicacion, onDescartar }) => {
  const Images = [
    "/Imagenes/Movimiento/back-mov.svg",
    "/Imagenes/Movimiento/mov1.svg",
    "/Imagenes/Movimiento/mov2.svg",
    "/Imagenes/Movimiento/mov3.svg",
    "/Imagenes/Movimiento/mov4.svg",
    "/Imagenes/Movimiento/mov5.svg",
    "/Imagenes/Movimiento/mov6.svg",
    "/Imagenes/Movimiento/mov7.svg"
  ];

  const [isActive, setIsActive] = useState(false);
  const { jugando, setJugando, handleMouseEnter, handleMouseLeave } = useContext(PartidaContext);
  const { seleccionada, setSeleccionada } = useContext(CartasMovimientoContext);
  const { wsUCMRef } = useContext(WebSocketContext);

  const usarCartaMovimiento = () => {
    if (!jugando || seleccionada === id || seleccionada === null) {
      // ...código de conexión WebSocket...
      setIsActive(!isActive);
      setSeleccionada(id);
      setJugando(!jugando);
    } 
  };

  const manejarDescartar = (completamente) => {
    onDescartar(id, completamente); // Llama a la función de descartar
  };

  const manejarDragEnd = (event) => {
    // Aquí podrías implementar la lógica para detectar si la carta fue "dejada a un lado"
    const dropArea = document.getElementById('drop-area');
    const rect = dropArea.getBoundingClientRect();

    if (event.clientX >= rect.left && event.clientX <= rect.right && 
        event.clientY >= rect.top && event.clientY <= rect.bottom) {
      manejarDescartar(false); // O manejarDescartar(true) si quieres descartar totalmente
    }
  };

  return (
    <div 
      className={`carta-movimiento ${isActive ? 'activa' : ''}`} 
      onClick={usarCartaMovimiento} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      draggable 
      onDragEnd={manejarDragEnd}
    >
      <img src={Images[(id % 7) + 1]} alt={`Carta de Movimiento ${(id % 7) + 1}`} className='carta-movimiento-img'/>
    </div>
  );
};

export default CartaMovimiento;
