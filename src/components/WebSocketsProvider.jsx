import React, { createContext, useEffect, useRef } from 'react';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const wsLPRef = useRef(null); // WebSocket de Listar Partidas
    const wsUPRef = useRef(null); // WebSocket de Unirse a Partida
    const wsUCMRef = useRef(null); // WebSocket de Usar Carta de Movimiento
    const wsStartGameRef = useRef(null); // WebSocket para iniciar partida

    useEffect(() => {
      wsUCMRef.current = new WebSocket('ws://tu-url-websocket-para-cartas-de-movimiento');

      wsUCMRef.current.onopen = () => {
          console.log("Conexión WebSocket para cartas de movimiento abierta");
      };

      wsUCMRef.current.onmessage = (event) => {
          // Aquí manejarás el evento de la carta de movimiento
          const data = JSON.parse(event.data);
          console.log("Carta de movimiento recibida:", data);
      };

      wsUCMRef.current.onerror = (error) => {
          console.error("Error en WebSocket de cartas de movimiento:", error);
      };

      wsUCMRef.current.onclose = () => {
          console.log("Conexión WebSocket de cartas de movimiento cerrada");
      };

      return () => {
          if (wsUCMRef.current) {
              wsUCMRef.current.close();
          }
      };
  }, []);





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