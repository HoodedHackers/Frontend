// src/components/CartaFigura.jsx
import React from 'react';
// import PropTypes from 'prop-types';
import './carta_figura.css'; 

function CartaFigura ({ tipo }) {

  const Images = [
    "/Imagenes/Figura/back.svg",
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
    "/Imagenes/Figura/25.svg"
  ]

  return (
    <div className="carta-figura">
      <img src={Images[tipo]} alt={`Carta de Figura ${tipo}`} className='carta-figura-img'/>
    </div>
  );
};

// Definición de los tipos de props para validación
// CartaFigura.propTypes = {
//   id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
// };

export default CartaFigura;