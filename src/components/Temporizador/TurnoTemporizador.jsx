import React, { useState, useEffect, useRef } from "react";
import styles from "./TurnoTemporizador.module.css";

const TurnoTemporizador = ({ tiempoLimite, jugadorActual, jugadoresEnPartida }) => {
  const [timeLeft, setTimeLeft] = useState(tiempoLimite);
  const [turnoFinalizado, setTurnoFinalizado] = useState(false);
  const audioRef = useRef(new Audio("/dun-dun-dun.mp3"));
  const [temporizadorIniciado, setTemporizadorIniciado] = useState(false);

  useEffect(() => {
    if (jugadoresEnPartida >= 2) {
      setTemporizadorIniciado(true);
    }
  }, [jugadoresEnPartida]);

  useEffect(() => {
    let countdown;

    if (temporizadorIniciado && !turnoFinalizado) {
      countdown = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) return prevTime - 1;
          else {
            setTurnoFinalizado(true);
            audioRef.current.play(); // Reproduce el audio
            return 0; // Asegúrate de no ir por debajo de 0
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(countdown);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, [temporizadorIniciado, turnoFinalizado]);

  useEffect(() => {
    if (turnoFinalizado) {
      const timeout = setTimeout(() => {
        resetTimer(); // Reinicia el temporizador después de que termine el turno
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [turnoFinalizado]);

  const resetTimer = () => {
    setTimeLeft(tiempoLimite);
    setTurnoFinalizado(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={styles.timerContainer}>
      <div className={styles.rectangulo}>
        <span className={styles.timerText}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
        {temporizadorIniciado && (
          <div className={styles.playerTurn}>
            <p>{`Turno de ${jugadorActual}`}</p>
          </div>
        )}
      </div>

      {turnoFinalizado && (
        <div className={styles.toast}>
          <p className={styles.finalizadoTexto}>¡Tu turno finalizó!</p>
        </div>
      )}
    </div>
  );
};

export default TurnoTemporizador;
