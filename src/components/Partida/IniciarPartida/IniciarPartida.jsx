import React, { useContext, useState } from 'react';
import styles from './IniciarPartida.module.css';

function IniciarPartida ({empezarPartida}) {
  const [loading, setLoading] = useState(false);

  const handleIniciar = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/partida/en_curso", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: 'startGame' }),
      });

      if (!response.ok) {
        throw new Error('Error al iniciar la partida');
      }
      empezarPartida();
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