import React, { useState, useEffect, useRef } from "react";
import "./Temporizador.css"; // Asegúrate de tener los estilos necesarios aquí

const Temporizador = ({ tiempoLimite, jugadorActual, onFinTurno }) => {
  const [timeLeft, setTimeLeft] = useState(
    () => Number(sessionStorage.getItem("timeLeft")) || tiempoLimite
  );
  const audioRef = useRef(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const socketRef = useRef(null);
  const [colorBloqueado, setColorBloqueado] = useState("#f52020"); // Rojo como valor inicial

  useEffect(() => {
    socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws/timer");

    socketRef.current.onopen = () => {
      console.log("Conexión WebSocket abierta");
      const startMessage = { action: "start" };
      socketRef.current.send(JSON.stringify(startMessage));
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      const colores = {
        red: "#f52020",
        blue: "#0000ff",
        yellow: "#ffff00",
        green: "#00ff00",
      };
      setColorBloqueado(colores[data.colorBloqueado] || "#f52020");
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
    setTimeLeft(tiempoLimite);
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
            setTimeLeft(tiempoLimite);
            setAudioPlayed(false);
          }, 1000);
          return 0;
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

  const getColor = () => {
    if (timeLeft <= 0) return "#ff0000"; // Rojo
    if (timeLeft <= 10) return "#ff7f00"; // Naranja
    return "#ffffff"; // Blanco
  };

  const timerClass = timeLeft <= 10 ? "timer-warning-active" : "";

  return (
    <div className="temporizador-container">
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
      {/* Nuevo rectángulo para el color bloqueado */}
      <div
  className="color-bloqueado"
  style={{
    backgroundColor: colorBloqueado,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40px',
    marginLeft: '-1px', // Ajusta este valor según sea necesario
  }}
>        <span style={{ fontSize: '25px', marginRight: '10px' }}>🔒</span> {/* Aumentar el tamaño del candado */}
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: colorBloqueado,
            borderRadius: '50%', // Redondear para que parezca un círculo
            display: 'inline-block',
          }}
        />
      </div>
    </div>
  );
};

export default Temporizador;
