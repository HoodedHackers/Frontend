// TableroContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { WebSocketContext } from '../../WebwsBS.currentsProvider.jsx';

// Crear el contexto
export const TableroContext = createContext();

// Proveedor del contexto
export const TableroProvider = ({ children }) => {
  const [squares, setSquares] = useState(generateInitialColors());
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [turnoActual, setTurnoActual] = useState(0);
  const [jugadoresActivos, setJugadoresActivos] = useState([true, true, true, true]);
  const { wsBSRef } = useContext(WebSocketContext);


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
      [newSquares[selectedIndex], newSquares[index]] = [newSquares[index], newSquares[selectedIndex]];
      setSquares(newSquares);
      setSelectedIndex(null);
      setTurnoActual((turnoActual + 1) % jugadoresActivos.length);
    }
  }

  let game_id = sessionStorage.getItem("partida_id");
  let player_id = sessionStorage.getItem("player_id");
  useEffect(() => {
    if (wsBSRef.current && wsBSRef.current.readyState !== WebSocket.CLOSED) {
      return;
    }

    try {
      wsBSRef.current = new WebwsBS.current(`ws://localhost:8000/ws/lobby/${game_id}/board?player_id=${player_id}`);
      wsBSRef.current.onopen = () => { wsBSRef.current.send(JSON.stringify({request: "status"})) };
  
      wsBSRef.current.onmessage = (event) => {
        console.log("Mensaje recibido por el WebSocket de Estado del Tablero: ", event.data);
        let data = JSON.parse(event.data);
        setSquares(numbersToSquares(data.board));
      };
    } catch (error) {
      console.error("Error al conectar al WebSocket de Estado del Tablero:", error);
    }
    
  }, [wsBSRef.current]);
  
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