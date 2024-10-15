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
  useEffect(() => {
    const socket = new WebSocket('wss://echo.websocket.org');
    
    socket.onmessage = (event) => {
      console.log("Mensaje recibido:", event.data);
      if (event.data.startsWith('{')) { // Verifica si parece un JSON
        try {
          const data = JSON.parse(event.data);
          if (data.action === 'tablero_actualizado') {
            setSquares(data.squares);
          }
        } catch (error) {
          console.warn("No se pudo parsear el mensaje como JSON:", event.data);
        }
      } else {
        console.warn("Mensaje recibido no es JSON:", event.data);
      }
    };
    
    return () => {
      socket.close();
    };
  }, []);
  
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