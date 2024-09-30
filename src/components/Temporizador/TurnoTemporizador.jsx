import React, { useState, useEffect, useRef } from "react";
import styles from "./TurnoTemporizador.module.css";

const TurnoTemporizador = ({ tiempoLimite, jugadorActual, onFinTurno }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTime = Number(localStorage.getItem("timeLeft"));
    return storedTime || tiempoLimite; // Carga el tiempo desde localStorage o establece el tiempo límite
  });
  
  const audioRef = useRef(null);
  const [audioPlayed, setAudioPlayed] = useState(false);

  // Inicializa la referencia del WebSocket
  const socketRef = useRef(null);
  
  useEffect(() => {
    // Conectar al WebSocket
    socketRef.current = new WebSocket("ws:127.0.0.1:8000/ws/timer");

    // Manejar la conexión abierta
    socketRef.current.onopen = () => {
      console.log("Conexión WebSocket abierta");
      const startMessage = { action: "start" };
      socketRef.current.send(JSON.stringify(startMessage));
      console.log("Mensaje enviado al backend para iniciar el temporizador.");
    };

    // Manejar mensajes entrantes
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.timeLeft !== undefined) {
        setTimeLeft(data.timeLeft);
        localStorage.setItem("timeLeft", data.timeLeft); // Actualiza el tiempo en localStorage
      }
      if (data.jugadorActualIndex !== undefined) {
        setJugadorActualIndex(data.jugadorActualIndex);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          if (!audioPlayed) {
            audioRef.current.play().catch((error) => {
              console.error("Error al reproducir el audio:", error);
            });
            setAudioPlayed(true);
          }
          setTimeout(() => {
            onFinTurno(); 
            setTimeLeft(tiempoLimite); // Reinicia el temporizador al valor original
            localStorage.setItem("timeLeft", tiempoLimite); // Reinicia el tiempo en localStorage
            setAudioPlayed(false); // Reinicia el estado de audio
          }, 2000);
          return 0; // Evitar valores negativos
        }
      });
    }, 1000);
  
    return () => clearInterval(countdown);
  }, [audioPlayed, onFinTurno, tiempoLimite]); 

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("timeLeft", timeLeft);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getColor = () => {
    if (timeLeft <= 0) return "#ff0000"; // Rojo cuando el tiempo es 0
    if (timeLeft <= 10) return "#ff7f00"; // Naranja para los últimos 10 segundos
    return "#ffffff"; // Blanco por defecto
  };

  const timerClass = timeLeft <= 10 ? styles["timer-warning-active"] : "";

  return (
    <div className={styles["timer-container"]}>
      <div className={styles.rectangulo}>
        <span className={`${styles["timer-text"]} ${timerClass}`} style={{ color: getColor() }}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
        <audio ref={audioRef} src="/dun-dun-dun.mp3" preload="auto" />
        <div className={styles.turnIndicator}>
          <p>
            Turno: <strong>{jugadorActual}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TurnoTemporizador;
