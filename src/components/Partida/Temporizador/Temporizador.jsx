import React, { useState, useEffect, useRef } from "react";
import "./Temporizador.css"; // Importa tu archivo CSS normal

const Temporizador = ({ tiempoLimite, jugadorActual, onFinTurno }) => {
  const [timeLeft, setTimeLeft] = useState(
    () => Number(sessionStorage.getItem("timeLeft")) || tiempoLimite
  );
  const audioRef = useRef(null);
  const [audioPlayed, setAudioPlayed] = useState(false);

  // Inicializa la referencia del WebSocket
  const socketRef = useRef(null);
  useEffect(() => {
    // Conectar al WebSocket
    socketRef.current = new WebSocket("http://127.0.0.1:8000/ws/timer");

    // Manejar la conexión abierta
    socketRef.current.onopen = () => {
      console.log("Conexión WebSocket abierta");
      // Enviar mensaje para iniciar el Temporizador
      const startMessage = { action: "start" };
      socketRef.current.send(JSON.stringify(startMessage));
      console.log("Mensaje enviado al backend para iniciar el Temporizador.");
    };

    // Manejar mensajes entrantes
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
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
    setTimeLeft(tiempoLimite); // Reiniciar el Temporizador cuando cambie el jugador

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
            setTimeLeft(tiempoLimite); // Reinicia el Temporizador al valor original
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

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Cambiar color del texto dependiendo del tiempo
  const getColor = () => {
    if (timeLeft <= 0) return "#ff0000"; // Rojo cuando el tiempo es 0
    if (timeLeft <= 10) return "#ff7f00"; // Naranja para los últimos 10 segundos
    return "#ffffff"; // Blanco por defecto
  };

  const timerClass = timeLeft <= 10 ? "timer-warning-active" : "";

  return (
    <div className="rectangulo">
      <span className={`timer-text ${timerClass}`} style={{ color: getColor() }}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
      <audio ref={audioRef} src="/dun-dun-dun.mp3" preload="auto" />
      <div className="turnIndicator">
        <p>
          Turno: <strong>{jugadorActual}</strong>
        </p>
      </div>
    </div>
  );  
};

export default Temporizador;
