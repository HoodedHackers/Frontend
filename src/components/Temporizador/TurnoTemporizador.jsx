import React, { useState, useEffect, useRef } from "react";
import styles from "./TurnoTemporizador.module.css";

const TurnoTemporizador = ({ tiempoLimite, jugadorActual, onFinTurno }) => {
  const [timeLeft, setTimeLeft] = useState(
    () => Number(localStorage.getItem("timeLeft")) || tiempoLimite
  );
  const audioRef = useRef(null);
  const [audioPlayed, setAudioPlayed] = useState(false);

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
          // Establece un retraso antes de llamar a onFinTurno
          setTimeout(() => {
            onFinTurno(); // Llama a onFinTurno después de 2 segundos
            setTimeLeft(tiempoLimite); // Reinicia el temporizador al valor original
            setAudioPlayed(false); // Reinicia el estado de audio
          }, 2000);
          return 0; // Evitar valores negativos
        }
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [audioPlayed, onFinTurno, tiempoLimite]);

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
