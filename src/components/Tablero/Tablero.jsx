import { useState, useEffect } from 'react';
import styles from './Tablero.module.css';

// Colores disponibles
const colors = ['#f3e84c', '#1d53b6', '#f52020', '#27f178'];

function Square({ color, onClick, isSelected }) {
  return (
    <button
      className={`${styles.square} ${isSelected ? styles.selected : ''}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
    </button>
  );
}

function Board({ squares, onSquareClick, selectedIndex }) {
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

export default function Tablero({ jugadores }) {
  const [squares, setSquares] = useState(generateInitialColors());
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [turnoActual, setTurnoActual] = useState(0); // Índice del jugador actual

  function generateInitialColors() {
    const colorDistribution = [
      ...Array(9).fill(colors[0]), // amarillo
      ...Array(9).fill(colors[1]), // azul
      ...Array(9).fill(colors[2]), // rojo
      ...Array(9).fill(colors[3]), // verde
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

      // Cambiar el turno
      setTurnoActual((turnoActual + 1) % jugadores.length);
      
      enviarDatosTablero(newSquares);
    }
  }

  async function enviarDatosTablero(updatedSquares) {
    const data = {
      squares: updatedSquares,
      nickname: jugadores[turnoActual].nickname,
    };

    try {
      const response = await fetch("https://ejemplo-api.com/tablero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resultado = await response.json();
      console.log("Datos del tablero enviados con éxito:", resultado);
    } catch (error) {
      console.error("Error al enviar los datos del tablero:", error);
    }
  }

  useEffect(() => {
    const socket = new WebSocket("ws://tu-servidor-websocket/ws/tablero");

    socket.onopen = () => {
      console.log("Conexión WebSocket abierta");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.squares) {
        setSquares(data.squares);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className={styles.game}>
      <div className={styles.turnLabel}>
        {jugadores[turnoActual].nickname}'s Turn
      </div>
      <div className={styles.gameBoard}>
        <Board squares={squares} onSquareClick={handleSquareClick} selectedIndex={selectedIndex} />
      </div>
      <div className={styles.nextPlayerLabels}>
        {jugadores.map((jugador, index) => (
          <div key={index} className={styles.label}>
            {jugador.nickname}
          </div>
        ))}
      </div>
    </div>
  );
}
