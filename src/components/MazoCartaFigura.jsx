// src/components/MazoCartaFigura.jsx
import React, { useState, useEffect } from 'react';
import CartaFigura from './CartaFigura'; // Importamos el componente CartaFigura
import './MazoCartaFigura.css'; // Estilos para el contenedor de MazoCartaFigura

const MazoCartaFigura = () => {
  const [mazo, setMazo] = useState([]); // Estado para almacenar el array de cartas del mazo

  // Función para obtener las cartas desde el backend
  const obtenerMazo = async () => {
    try {
      //const response = await fetch('https://api.backend/mazo'); // URL para obtener las cartas del mazo (cambiar por la URL real)
      //const data = await response.json(); // Asume que la respuesta contiene un array de cartas con propiedad 'id'

      const data = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
      ];

      setTimeout(() => {
        setMazo(data); // Actualiza el estado 'mazo' con las cartas obtenidas del backend
      }, 1000); // Simula un retardo de 1 segundo (1000 ms)
      
    } catch (error) {
      console.error('Error al obtener el mazo de cartas:', error); // Muestra el error en la consola
    }
  };

  // Efecto para obtener las cartas al montar el componente
  useEffect(() => {
    obtenerMazo(); // Llama a la función para obtener el mazo al montar el componente
  }, []);

  return (
      <div className="container-cartas-figura">
        {mazo.slice(0, 3).map((carta) => ( // Mostramos solo las primeras tres cartas
          <CartaFigura key={carta.id} id={carta.id} />
        ))}
      </div> 
  );
};

export default MazoCartaFigura;