import React, { useState, useEffect, useRef } from "react";
import styles from "./temporizador.module.css";

const Temporizador = ({ tiempoLimite, jugadorActual, onFinTurno }) => {
  const [timeLeft, setTimeLeft] = useState(
    () => Number(localStorage.getItem("timeLeft")) || tiempoLimite
  );
  const audioRef = useRef(null);
  const [audioPlayed, setAudioPlayed] = useState(false);

  // Inicializa la referencia del WebSocket
  const socketRef = useRef(null);
  useEffect(() => {
    // Conectar al WebSocket
    socketRef.current = new WebSocket("ws://httpbin.org/post");

    // Manejar la conexión abierta
    socketRef.current.onopen = () => {
      console.log("Conexión WebSocket abierta");

      // Enviar mensaje para iniciar el temporizador
      const startMessage = { action: "start" };
      socketRef.current.send(JSON.stringify(startMessage));
      console.log("Mensaje enviado al backend para iniciar el temporizador.");
    };

    // Manejar mensajes entrantes
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Si recibimos la información de tiempo restante
      if (data.timeLeft !== undefined) {
        setTimeLeft(data.timeLeft);
      }

      // Si se recibe un nuevo turno
      if (data.jugadorActualIndex !== undefined) {
        setJugadorActualIndex(data.jugadorActualIndex);
      }
    };

    // Manejar errores
    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cerrar la conexión al desmontar el componente
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    setTimeLeft(tiempoLimite); // Reiniciar el temporizador cuando cambie el jugador
  
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
          // Establece un retraso antes de llamar a onFinTurno
          setTimeout(() => {
            onFinTurno(); 
            setTimeLeft(tiempoLimite); // Reinicia el temporizador al valor original
            setAudioPlayed(false); // Reinicia el estado de audio
          }, 1000); // Cambiar a 1000 ms (1 segundo)
          return 0; // Evitar valores negativos
        }
      });
    }, 1000);
  
    return () => clearInterval(countdown);
  }, [audioPlayed, onFinTurno, tiempoLimite, jugadorActual]); 

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleAudioEnd = () => {
      setTimeout(() => {
        setAudioPlayed(false);
      }, 1000);
    };

    if (audioElement) {
      audioElement.addEventListener("ended", handleAudioEnd);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleAudioEnd);
      }
    };
  }, []);

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

  // Cambiar color del texto dependiendo del tiempo
  const getColor = () => {
    if (timeLeft <= 0) return "#ff0000"; // Rojo cuando el tiempo es 0
    if (timeLeft <= 10) return "#ff7f00"; // Naranja para los últimos 10 segundos
    return "#ffffff"; // Blanco por defecto
  };

  // Función que divide un nombre en partes de 16 caracteres
  function dividirNombre(nombre) {
    const partes = [];
    let posicion = 0;
    while (posicion < nombre.length) {
      const corte = nombre.substr(posicion, 16);
      partes.push(corte);
      posicion += 16;
    }

    return partes;
  }

  const timerClass = timeLeft <= 10 ? styles["timer-warning-active"] : "";

  return (
    <div className={styles.rectangulo}>
      <span className={`${styles["timer-text"]} ${timerClass}`} style={{ color: getColor() }}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
      <audio ref={audioRef} src="/dun-dun-dun.mp3" preload="auto" />
      <div className={styles.turnIndicator}>
        <p>
          Turno: <strong>{dividirNombre(jugadorActual).map((parte, index) => (
            <span key={index}>{parte}<br /></span>
          ))}</strong>
        </p>
      </div>
    </div>
  );  
};

export default Temporizador;
