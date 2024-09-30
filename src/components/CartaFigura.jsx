// src/components/CartaFigura.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './CartaFigura.css'; 

const CartaFigura = ({ id }) => {

  const imagenId = `/Imagenes/Figura/${id}.svg`; 

  return (
    <div className="carta-figura">
      <img src={imagenId} alt={`Carta de figura ${id}`} />
    </div>
  );
};

// Definición de los tipos de props para validación
CartaFigura.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default CartaFigura;