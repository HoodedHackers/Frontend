// src/components/CartaFigura.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './CartaFigura.css'; // Archivo de estilos para CartaFigura

const CartaFigura = ({ id }) => {

  const imagenId = `/assets/cartasFigura/${id}.png`; // Ruta de la imagen de la carta segun su id.

  return (
    <div className={"carta-figura"}>
      <img src={imagenId} alt={`Carta de figura ${id}`} />
    </div>
  );
};

// Definición de los tipos de props para validación
CartaFigura.propTypes = {
  id: PropTypes.string.isRequired,  // Tipo de carta, por ejemplo "Rey", "Reina", etc.
};

export default CartaFigura;