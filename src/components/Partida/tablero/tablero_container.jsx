import React, { useState, useEffect } from 'react';
import styles from './tablero_container.module.css';

// Colores disponibles
const COLORES = ['#f3e84c', '#1d53b6', '#f52020', '#27f178'];

function Square({ color, onClick, isSelected }) {
  return (
    <button
      className={`${styles.square} ${isSelected ? styles.selected : ''}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    />
  );
}

function Tablero({ squares, onSquareClick, selectedIndex }) {
  return (
    <>
      {[0, 6, 12, 18, 24, 30].map(rowStart => (
        <div className={styles.boardRow} key={rowStart}>
          {squares.slice(rowStart, rowStart + 6).map((color, i) => (
            <Square
              key={i + rowStart}
              color={color}
              onClick={() => onSquareClick(rowStart + i)}
              isSelected={selectedIndex === rowStart + i}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default function Tablero_Container({ jugadores }) {
  const [squares, setSquares] = useState(generateInitialColors());
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [turnoActual, setTurnoActual] = useState(0);
  const [jugadoresActivos, setJugadoresActivos] = useState([true, true, true, true]);
  const [socket, setSocket] = useState(null);

  function generateInitialColors() {
    const colorDistribution = [
      ...Array(9).fill(COLORES[0]), // amarillo
      ...Array(9).fill(COLORES[1]), // azul
      ...Array(9).fill(COLORES[2]), // rojo
      ...Array(9).fill(COLORES[3]), // verde
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
      setTurnoActual((turnoActual + 1) % jugadores.length);
    }
  }

  useEffect(() => {
    const newSocket = new WebSocket("https://httpbin.org/post");
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("Conexión WebSocket abierta");
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.squares) {
        setSquares(data.squares);
      }
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div className={styles.tableroContainer}>
      <div className={styles.boardContainer}>
        <Tablero squares={squares} onSquareClick={handleSquareClick} selectedIndex={selectedIndex} />
      </div>
    </div>
  );
}
