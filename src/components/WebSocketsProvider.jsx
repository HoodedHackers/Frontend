import React, { createContext, useRef } from 'react';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const wsLPRef = useRef(null); // WebSocket de Listar Partidas
    const wsUPRef = useRef(null); // WebSocket de Unirse a Partida
    const wsUCMRef = useRef(null); // WebSocket de Usar Carta de Movimiento
    const wsStartGameRef = useRef(null); // WebSocket para iniciar partida
    const wsTRef = useRef(null); // WebSocket para pasar turno
    const wsBSRef = useRef(null); // WebSocket para el Estado del Tablero (Board State)
    const wsCFRef = useRef(null); // WebSocket para cartas de figuras

  return (
    <WebSocketContext.Provider
      value={{
        wsLPRef,
        wsUPRef,
        wsUCMRef,
        wsStartGameRef,
        wsTRef,
        wsBSRef,
        wsCFRef,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};