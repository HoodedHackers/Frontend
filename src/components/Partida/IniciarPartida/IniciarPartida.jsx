import React, { useContext, useState } from 'react';
import { PartidaContext } from '../PartidaProvider.jsx';
import styles from './IniciarPartida.module.css';

function IniciarPartida({ id_game, playerIdentifier }) {
  const { setPartidaIniciada } = useContext(PartidaContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Agregar estado para mensajes de error

  const handleIniciar = async () => {
    setLoading(true);
    setErrorMessage(''); // Limpiar mensaje de error anterior
    
    const partidaID = localStorage.getItem('partidaId');
    const id_jugador = sessionStorage.getItem('identifier');
    try {
      let body = JSON.stringify({ identifier: id_jugador });
      console.log(body);
      const response = await fetch(`http://127.0.0.1:8000/api/lobby/${partidaID}/start`, {
        method: "PUT",  
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al iniciar la partida');
      }

      sessionStorage.setItem('partidaIniciada', "true");
      setPartidaIniciada(true);
    } catch (error) {
      console.error('Error al iniciar la partida:', error);
      setErrorMessage(error.message); // Establecer mensaje de error para mostrar en la interfaz
    } finally {
      setLoading(false); // Asegurarse de que loading se desactive en cualquier caso
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
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>} 
    </div>
  );
}

export default IniciarPartida;