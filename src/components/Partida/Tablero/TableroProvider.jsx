// TableroContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import {PartidaContext} from '../PartidaProvider';
import { WebSocketContext } from '../../WebSocketsProvider.jsx';


// Crear el contexto
export const TableroContext = createContext();

// Proveedor del contexto
export const TableroProvider = ({ children }) => {
  const [squares, setSquares] = useState(generateInitialColors());
  const [figurasEnTablero, setFigurasEnTablero] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [turnoActual, setTurnoActual] = useState(0);
  const [jugadoresActivos, setJugadoresActivos] = useState([true, true, true, true]);
  const { cartaMovimientoActualId, cartaMovimientoActualIndex } = useContext(PartidaContext);
  const { wsBSRef } = useContext(WebSocketContext);


  // Colores disponibles
  const COLORES = ['#f3e84c', '#1d53b6', '#f52020', '#27f178'];
  const colorToImageMap = {
    '#f3e84c': '/Imagenes/Tablero/A.svg',
    '#1d53b6': '/Imagenes/Tablero/B.svg',
    '#f52020': '/Imagenes/Tablero/C.svg',
    '#27f178': '/Imagenes/Tablero/D.svg',
  };

function numbersToSquares(colores, posicionesResaltadas) {
  let colors = ['#f3e84c',
    '#1d53b6',
    '#f52020',
    '#27f178'];
    return colores.map((x, index) => ({
      color: colors[x - 1], // Asignar el color basado en el número
      highlighted: posicionesResaltadas.includes(index), // Verificar si la posición está resaltada
    }));
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
      // Selecciona el cuadrado si no hay ninguno seleccionado
      setSelectedIndex(index);
      console.log(`Jugador ${sessionStorage.getItem("identifier")} seleccionó el cuadrado en posición: ${index}`);
    } else {
      const newSquares = [...squares];

      // Guardar la posición de origen y destino
      const origen = selectedIndex;
      const destino = index;

      // Cambiar las posiciones de las fichas
      [newSquares[origen], newSquares[destino]] = [newSquares[destino], newSquares[origen]];

      // Actualizar el estado
      setSquares(newSquares);
      setSelectedIndex(null);
      setTurnoActual((turnoActual + 1) % jugadoresActivos.length); // Actualizar el estado

      // Obtener el ID de la carta en uso y el identifier (esto debería estar de
      const identifier = sessionStorage.getItem("identifier");

      // Enviar la información al backend
      enviarMovimiento(identifier, origen, destino);
    }
  }

  // Función para enviar el movimiento al backend
  async function enviarMovimiento(identifier, origen, destino){
    const game_id = sessionStorage.getItem("partida_id");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/game/${game_id}/play_card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifier, // UUID del jugador
          origin_tile: origen, // Posición de origen
          dest_tile: destino, // Posición de destino
          card_mov_id: cartaMovimientoActualId, // ID de la carta
          index_hand: cartaMovimientoActualIndex, // Índice de la carta en la mano
        }),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (!response.ok) {
        console.error("Error al realizar el movimiento:", data.detail);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  }

  // Función para extraer todas las fichas resaltas
  function extractHighlightedTiles(possibleFigures) {
    return possibleFigures.flatMap(player =>
      player.moves.flatMap(move => move.tiles)
    );
  }

  function extractFiguresData(possibleFigures) {
    return possibleFigures.flatMap(player =>
      player.moves.map(move => ({
        tiles: move.tiles,    // Arreglo de enteros (posiciones)
        fig_id: move.fig_id,  // ID de la figura
      }))
    );
  }  

  useEffect(() => {
    let game_id = sessionStorage.getItem("partida_id");
    let player_id = sessionStorage.getItem("player_id");

    if (wsBSRef.current && wsBSRef.current.readyState !== WebSocket.CLOSED) {
      return;
    }

    try {
      wsBSRef.current = new WebSocket(`ws://localhost:8000/ws/lobby/${game_id}/board?player_id=${player_id}`);
      wsBSRef.current.onopen = () => { wsBSRef.current.send(JSON.stringify({request: "status"})) };
  
      wsBSRef.current.onmessage = (event) => {
        console.log("Mensaje recibido por el WebSocket de Estado del Tablero: ", event.data);
        let data = JSON.parse(event.data);
        const extractedTiles = extractHighlightedTiles(data.possible_figures);
        const figurasEnTablero = extractFiguresData(data.possible_figures);
        sessionStorage.setItem("figurasEnTablero", JSON.stringify(figurasEnTablero));
        setFigurasEnTablero(figurasEnTablero);
        setSquares(numbersToSquares(data.board, extractedTiles));

        //pa' proba'
        //setSquares(numbersToSquares(
        //  [1,2,1,2,4,3,1,3,2,2,2,1,1,4,4,2,1,4,1,2,1,3,3,4,1,4,3,4,3,4,2,3,3,3,2,4],
        //  [0,3,6,8,9,10,12,15,17,18,23,24,26,29,31,32,33,35])
        //); 
      };
    } catch (error) {
      console.error("Error al conectar al WebSocket de Estado del Tablero:", error);
    }
    
  }, [wsBSRef.current]);
  
  return (
    <TableroContext.Provider
      value={{
        squares,
        setSquares,
        selectedIndex,
        turnoActual,
        handleSquareClick,
        colorToImageMap,
        figurasEnTablero,
        setFigurasEnTablero
      }}
    >
      {children}
    </TableroContext.Provider>
  );
};