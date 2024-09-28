import React, { useEffect, useState } from "react";
import TurnoTemporizador from "../Temporizador/TurnoTemporizador";
import styles from "./Partida.module.css"; 

const Partida = () => {
  const tiempoLimite = 120; // 2 minutos
  const [jugadores] = useState(["ely", "max", "jane"]); // Array de jugadores
  const [jugadorActualIndex, setJugadorActualIndex] = useState(() => {
    // Recupera el índice del jugador actual del localStorage, o usa 0 si no existe
    const storedIndex = localStorage.getItem("jugadorActualIndex");
    return storedIndex !== null ? Number(storedIndex) : 0;
  });

  const jugadorActual = jugadores[jugadorActualIndex]; // Obtener el jugador actual

  const manejarFinTurno = () => {
    // Cambia al siguiente jugador
    setJugadorActualIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % jugadores.length;
      localStorage.setItem("jugadorActualIndex", newIndex); // Guarda el nuevo índice en localStorage
      return newIndex;
    });
  };

  useEffect(() => {
    // Cambia esta URL al de tu servidor WebSocket
    const socket = new WebSocket("ws://tu-servidor-websocket/ws/timer");
  
    // Manejo de la conexión abierta
    socket.onopen = () => {
      console.log("Conexión WebSocket abierta");
  
      // Si deseas iniciar el temporizador al abrir la conexión
      socket.send(JSON.stringify({ action: "start" }));
    };
  
    // Manejo de mensajes recibidos
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Maneja los mensajes según los datos recibidos
      if (data.status) {
        console.log(data.status); // Muestra el estado en la consola
  
        // Si se recibe un nuevo turno, actualiza el jugador actual
        if (data.turno) {
          const jugadorNuevo = jugadores.indexOf(data.turno);
          if (jugadorNuevo !== -1) {
            setJugadorActualIndex(jugadorNuevo);
            localStorage.setItem("jugadorActualIndex", jugadorNuevo); // Guarda el nuevo índice en localStorage
          }
        }
      }
    };
  
    // Manejo de errores
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    // Cierre de la conexión WebSocket al desmontar el componente
    return () => {
      socket.close();
    };
  }, [jugadores]);
  

  return (
    <div className={styles.partidaContainer}>
      <TurnoTemporizador 
        tiempoLimite={tiempoLimite} 
        jugadorActual={jugadorActual} 
        onFinTurno={manejarFinTurno} 
      />
    </div>
  );
};

export default Partida;
