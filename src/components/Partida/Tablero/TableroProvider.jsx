// TableroContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const TableroContext = createContext();

// Proveedor del contexto
export const TableroProvider = ({ children }) => {
  const [squares, setSquares] = useState(generateInitialColors());
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [turnoActual, setTurnoActual] = useState(0);
  const [jugadoresActivos, setJugadoresActivos] = useState([true, true, true, true]);


  // Colores disponibles
const COLORES = ['#f3e84c', '#1d53b6', '#f52020', '#27f178'];
const colorToImageMap = {
  '#f3e84c': '/Imagenes/Tablero/A.svg',
  '#1d53b6': '/Imagenes/Tablero/B.svg',
  '#f52020': '/Imagenes/Tablero/C.svg',
  '#27f178': '/Imagenes/Tablero/D.svg',
};

  function generateInitialColors() {
    const colorDistribution = [
      ...Array(9).fill('#f3e84c'), // amarillo
      ...Array(9).fill('#1d53b6'), // azul
      ...Array(9).fill('#f52020'), // rojo
      ...Array(9).fill('#27f178'), // verde
    ];
  
    for (let i = colorDistribution.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colorDistribution[i], colorDistribution[j]] = [colorDistribution[j], colorDistribution[i]];
    }
  
    return colorDistribution.slice(0, 36);
  }

  function handleSquareClick(index) {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      const newSquares = [...squares];
      [newSquares[selectedIndex], newSquares[index]] = [newSquares[index], newSquares[selectedIndex]];
      setSquares(newSquares);
      setSelectedIndex(null);
      setTurnoActual((turnoActual + 1) % jugadoresActivos.length);
    }
  }

  return (
    <TableroContext.Provider
      value={{
        squares,
        selectedIndex,
        turnoActual,
        handleSquareClick,
        setSquares,
        colorToImageMap
      }}
    >
      {children}
    </TableroContext.Provider>
  );
};
