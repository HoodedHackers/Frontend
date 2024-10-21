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
  const [movimientosRealizados, setMovimientosRealizados] = useState([]);

  // Colores disponibles
const COLORES = ['#f3e84c', '#1d53b6', '#f52020', '#27f178'];
const colorToImageMap = {
  '#f3e84c': '/Imagenes/Tablero/A.svg',
  '#1d53b6': '/Imagenes/Tablero/B.svg',
  '#f52020': '/Imagenes/Tablero/C.svg',
  '#27f178': '/Imagenes/Tablero/D.svg',
};

function numbersToSquares(numbers) {
  let colors = ['#f3e84c',
    '#1d53b6',
    '#f52020',
    '#27f178'];
  return numbers.map((x) => colors[x - 1]);
}

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
      // Realizar swap de fichas
      [newSquares[selectedIndex], newSquares[index]] = [newSquares[index], newSquares[selectedIndex]];
      setSquares(newSquares);

      // Guardar que se realizó un movimiento
      setMovimientosRealizados(prev => [...prev, { from: selectedIndex, to: index }]);

      // Limpiar selección
      setSelectedIndex(null);
      // Pasar turno al siguiente jugador
      setTurnoActual((turnoActual + 1) % jugadoresActivos.length);
    }
  }

  let game_id = sessionStorage.getItem("partida_id");
  let player_id = sessionStorage.getItem("player_id");
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/lobby/${game_id}/board?player_id=${player_id}`);
    socket.onopen = () => { socket.send(JSON.stringify({ request: "status" })) };

    socket.onmessage = (event) => {
      console.log("Mensaje recibido:", event.data);
      let data = JSON.parse(event.data);
      setSquares(numbersToSquares(data.board));
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
        movimientosRealizados,
        handleSquareClick,
        setSquares,
        colorToImageMap
      }}
    >
      {children}

    </TableroContext.Provider>
  );
};
