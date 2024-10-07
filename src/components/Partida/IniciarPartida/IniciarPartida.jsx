import React, { useContext, useState } from 'react';
import { PartidaContext } from '../PartidaProvider.jsx';
import styles from './IniciarPartida.module.css';

function IniciarPartida () {
  const { setPartidaIniciada } = useContext(PartidaContext);
  const [loading, setLoading] = useState(false);

  const handleIniciar = async () => {
    setLoading(true);
    
    // Simulación de llamada al backend para iniciar la partida
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

      sessionStorage.setItem('partidaIniciada', "true");
      setPartidaIniciada(true);
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