import React, { useState } from 'react';
import styles from './iniciar_partida.module.css';

function Iniciar_Partida ({ onIniciar }) {
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

      onIniciar();  // Llamar al callback para notificar que la partida ha comenzado
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

export default Iniciar_Partida;