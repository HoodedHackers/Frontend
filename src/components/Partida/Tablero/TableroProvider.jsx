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
  // figurasEnTablero es un arreglo de objetos con la siguiente estructura:
  //  [
  //    {
  //      "player_id": int,
  //      "moves": [
  //          {
  //              "tiles": [int],
  //              "fig_id": int
  //          }
  //      ]
  //    },
  //    {
  //      "player_id": int,
  //      "moves": [
  //          {
  //              "tiles": [int],
  //              "fig_id": int
  //          }
  //      ]
  //    }
  //  ...
  //  ]
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [turnoActual, setTurnoActual] = useState(0);
  const [jugadoresActivos, setJugadoresActivos] = useState([true, true, true, true]);
  const {
    cartaMovimientoActualId,
    cartaMovimientoActualIndex,
    setCartasDelJugador ,
    setJugandoMov,
    jugandoFig,
    setForbiddenColor
  } = useContext(PartidaContext);
  const { wsBSRef, wsCRef } = useContext(WebSocketContext);
  const [errorMensaje, setErrorMensaje] = useState(null); // Nuevo estado para el mensaje de error
  const [modoDaltonismo, setModoDaltonismo] = useState(false);


  function toggleModoDaltonismo() {
    setModoDaltonismo((prevModo) => !prevModo);
  }

  // Colores disponibles
  const COLORES = ['#f52020', '#f3e84c', '#27f178', '#1d53b6'];
  const colorToImageMap = {
    normal: {
      '#f52020': '/Imagenes/Tablero/A.svg',
      '#f3e84c': '/Imagenes/Tablero/B.svg',
      '#27f178': '/Imagenes/Tablero/C.svg',
      '#1d53b6': '/Imagenes/Tablero/D.svg',
    },
    daltonismo: {
      '#f52020': '/Imagenes/Tablero/A_dalt.jpeg',
      '#f3e84c': '/Imagenes/Tablero/B_dalt.jpeg',
      '#27f178': '/Imagenes/Tablero/C_dalt.jpeg',
      '#1d53b6': '/Imagenes/Tablero/D_dalt.jpeg',
    }
  };

function numbersToSquares(colores, posicionesResaltadas) {
    return colores.map((x, index) => ({
      color: COLORES[x - 1], // Asignar el color basado en el número
      highlighted: posicionesResaltadas.includes(index), // Verificar si la posición está resaltada
    }));
}


  // Temporizador para borrar el mensaje de error después de 3 segundos
  useEffect(() => {
    if (errorMensaje) {
      const timer = setTimeout(() => setErrorMensaje(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMensaje]);

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
    if (jugandoFig) {
      const playerId = parseInt(sessionStorage.getItem("player_id"), 10);
      const jugador = figurasEnTablero.find(j => j.player_id === playerId);
      if(jugador.moves.some(move => move.tiles.includes(index))) {
        const move = jugador.moves.find(m => m.tiles.includes(index));
        const id_figura = move.fig_id;
        const color = move.color;
        enviarFigura(id_figura, color);
      }
    }
    else if (selectedIndex === index) {
      // Si el índice ya está seleccionado, deselecciona el cuadrado
      setSelectedIndex(null);
    } else if (selectedIndex === null) {
      // Selecciona el cuadrado si no hay ninguno seleccionado
      setSelectedIndex(index);
    } else {
      // Guardar la posición de origen y destino
      const origen = selectedIndex;
      const destino = index;

      // Obtener el ID de la carta en uso y el identifier
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

    if (!response.ok) {
      setErrorMensaje(data.detail); // Guardar el mensaje de error
      console.error("Error al realizar el movimiento:", data.detail);
    }
    else {
      sessionStorage.setItem("cartas_mov", JSON.stringify(data.card_mov));
      setCartasDelJugador(data.card_mov);
      setJugandoMov(false);
      setSelectedIndex(null); // Desseleccionar después de un movimiento exitoso
      setErrorMensaje(null); // Limpiar el mensaje de error si el movimiento es exitoso
    }
  } catch (error) {
    setErrorMensaje("Error al conectar con el servidor."); // Guardar mensaje de error de conexión
    sessionStorage.setItem("cartas_mov", JSON.stringify(data.card_mov));
    setCartasDelJugador(data.card_mov);
    console.error("Error al conectar con el servidor:", error);
  }
}

  // Función para enviar la figura al backend
  async function enviarFigura(id_figura, color){
    const game_id = sessionStorage.getItem("partida_id");
    const message = {
      player_identifier: sessionStorage.getItem("identifier"),
      card_id: id_figura,
      color: color
    };

   try {
     const response = await fetch(`http://127.0.0.1:8000/api/lobby/in-course/${game_id}/discard_figs`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(message),
     });
     if (!response.ok) {
       throw new Error("Error al enviar la Carta de Figura elegida: ", response);
     }
     else {
        const player_name = sessionStorage.getItem("player_nickname");
        wsCRef.current.send(JSON.stringify({message: `${player_name} ha descartado una carta de figura.`}));
     }
   } catch (error) {
     console.error("Error al enviar la Carta de Figura elegida: ", error);
   }
  }

  // Función para extraer todas las fichas resaltas
  function extractHighlightedTiles(possibleFigures) {
    return possibleFigures.flatMap(player =>
      player.moves.flatMap(move => move.tiles)
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
        sessionStorage.setItem("figurasEnTablero", JSON.stringify(data.possible_figures));
        setFigurasEnTablero(data.possible_figures);
        setSquares(numbersToSquares(data.board, extractedTiles));
        sessionStorage.setItem("board", JSON.stringify(data.board));
        setForbiddenColor(COLORES[data.forbidden_color - 1]);
        setJugandoMov(false);
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
        setFigurasEnTablero,
        modoDaltonismo,
        toggleModoDaltonismo

      }}
    >
    {errorMensaje && <div className="errorMensaje">{errorMensaje}</div>}
      {children}
    </TableroContext.Provider>
  );
};
