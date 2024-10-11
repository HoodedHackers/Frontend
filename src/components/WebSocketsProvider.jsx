import React, { createContext, useEffect, useRef } from 'react';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const wsUPRef = useRef(null); // WebSocket de Unirse a Partida

  return (
    <WebSocketContext.Provider
      value={{
        wsUPRef
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};