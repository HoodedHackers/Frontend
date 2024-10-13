import React, { createContext, useEffect, useRef } from 'react';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const wsLPRef = useRef(null); // WebSocket de Listar Partidas
    const wsUPRef = useRef(null); // WebSocket de Unirse a Partida

  return (
    <WebSocketContext.Provider
      value={{
        wsLPRef,
        wsUPRef
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};