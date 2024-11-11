// src/components/CartaFigura.jsx
import React from 'react';
// import PropTypes from 'prop-types';
import './CartaFigura.css'; 

function CartaFigura ({ tipo }) {

  const Images = [
    "/Imagenes/Figura/25.svg",
    "/Imagenes/Figura/1.svg",
    "/Imagenes/Figura/2.svg",
    "/Imagenes/Figura/3.svg",
    "/Imagenes/Figura/4.svg",
    "/Imagenes/Figura/5.svg",
    "/Imagenes/Figura/6.svg",
    "/Imagenes/Figura/7.svg",
    "/Imagenes/Figura/8.svg",
    "/Imagenes/Figura/9.svg",
    "/Imagenes/Figura/10.svg",
    "/Imagenes/Figura/11.svg",
    "/Imagenes/Figura/12.svg",
    "/Imagenes/Figura/13.svg",
    "/Imagenes/Figura/14.svg",
    "/Imagenes/Figura/15.svg",
    "/Imagenes/Figura/16.svg",
    "/Imagenes/Figura/17.svg",
    "/Imagenes/Figura/18.svg",
    "/Imagenes/Figura/19.svg",
    "/Imagenes/Figura/20.svg",
    "/Imagenes/Figura/21.svg",
    "/Imagenes/Figura/22.svg",
    "/Imagenes/Figura/23.svg",
    "/Imagenes/Figura/24.svg",
  ]

  return (
    <div className="carta-figura">
      <img 
        src={tipo == -1 ? "/Imagenes/Figura/back.svg" : Images[tipo]} 
        alt={tipo == -1 ? "Carta de Movimiento 0" : `Carta de Movimiento ${tipo + 1}`} 
        className='carta-figura-img'/>
    </div>
  );
};

// Definición de los tipos de props para validación
// CartaFigura.propTypes = {
//   id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
// };

export default CartaFigura;