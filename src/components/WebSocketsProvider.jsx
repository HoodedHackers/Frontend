import React, { createContext, useEffect, useRef } from 'react';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const wsLPRef = useRef(null); // WebSocket de Listar Partidas
    const wsUPRef = useRef(null); // WebSocket de Unirse a Partida
    const wsUCMRef = useRef(null); // WebSocket de Usar Carta de Movimiento
    const wsStartGameRef = useRef(null); // WebSocket para iniciar partida

  return (
    <WebSocketContext.Provider
      value={{
        wsLPRef,
        wsUPRef,
        wsUCMRef,
        wsStartGameRef

      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};