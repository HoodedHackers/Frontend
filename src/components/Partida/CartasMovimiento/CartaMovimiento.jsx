import React from 'react';
import './CartaMovimiento.css';

const CartaMovimiento = ({tipo}) => {
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

  return (
    <div className='carta-movimiento '>
        <img src={Images[tipo]} alt={`Carta de Movimiento ${tipo}`} className='carta-movimiento-img'/>
    </div>
  );
};

export default CartaMovimiento;
