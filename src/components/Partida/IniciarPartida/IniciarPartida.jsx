import React, { useContext, useState } from 'react';
import { PartidaContext } from '../PartidaProvider.jsx';
import styles from './IniciarPartida.module.css';

function IniciarPartida () {
  const { setPartidaIniciada, setPosicionJugador } = useContext(PartidaContext);
  const [loading, setLoading] = useState(false);

  function empezar() {
    // Reordena jugadores

    // Devuelve la posición del jugador principal o sino -1
    const jugadores = JSON.parse(sessionStorage.getItem("players"));
    const posicionJugador = jugadores.findIndex(jugador => jugador.id === parseInt(sessionStorage.getItem("player_id"), 10));
    setPosicionJugador(posicionJugador);
    if (posicionJugador == -1) {
      console.log("Jugador no encontrado");
      sessionStorage.removeItem("players");
    }
    else {
      // Coloca al jugador principal en la primera posición para que se renderice correctamente
      let jugadoresAux = jugadores[0];
      jugadores[0] = jugadores[posicionJugador];
      jugadores[posicionJugador] = jugadoresAux;
      sessionStorage.setItem("players", JSON.stringify(jugadores));
      sessionStorage.setItem('partidaIniciada', "true");
      setPartidaIniciada(true);
      console.log("Partida iniciada");
    }
  }

  const handleIniciar = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: 'startGame' }),
      });

      if (!response.ok) {
        throw new Error('Error al iniciar la partida');
      }
      empezar();
      setLoading(false);
    } catch (error) {
      console.error('Error al iniciar la partida:', error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <button
        className={styles.startButton}
        onClick={handleIniciar}
        disabled={loading}
      >
        {loading ? 'Iniciando...' : 'Iniciar Partida'}
      </button>
    </div>
  );
};

export default IniciarPartida;