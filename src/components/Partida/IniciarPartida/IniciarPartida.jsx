import React, { useContext, useState, useEffect } from 'react';
import styles from './IniciarPartida.module.css';
import { WebSocketContext } from '../../WebSocketsProvider.jsx';
import { PartidaContext } from '../PartidaProvider.jsx';

function IniciarPartida() {
  const { wsStartGameRef } = useContext(WebSocketContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [partidaIniciada, setPartidaIniciada] = useState(false);
  const [jugadores, setJugadores] = useState([]); // Estado para almacenar jugadores
  const {isOwner} = useContext(PartidaContext);

  const handleIniciar = async () => {
    setLoading(true);
    setErrorMessage('');

    sessionStorage.setItem('isOwner', 'false');
    const partidaID = sessionStorage.getItem('partida_id');
    const identifier = sessionStorage.getItem('identifier');

    try {
      let body = JSON.stringify({ identifier: identifier });
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
      
      // Enviar mensaje a través del WebSocket
      const startGameMessage = {
        action: "start",
        partidaID: partidaID,
        jugadores: [...jugadores, identifier] // Actualiza la lista de jugadores aquí
      };

      if (wsStartGameRef.current) {
        wsStartGameRef.current.send(JSON.stringify(startGameMessage));
        console.log("Mensaje enviado a través del WebSocket para notificar inicio de partida.");
      }

      console.log('Llamando a empezarPartida...');
    } catch (error) {
      console.error('Error al iniciar la partida:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentIdentifier = sessionStorage.getItem('identifier');
  

  console.log("Current Identifier:", currentIdentifier);

  return (
    <div className={styles.overlay}>
      {partidaIniciada ? (
        <p>La partida ha comenzado. ¡Prepárate para jugar!</p>
      ) : (
        <>
          {isOwner ? (
            <button
              className={styles.startButton}
              onClick={handleIniciar}
              disabled={loading}
            >
              {loading ? 'Iniciando...' : 'Iniciar Partida'}
            </button>
          ) : (
            <p className="waiting-message">Esperando a que el CREADOR inicie la partida...</p>          )}
        </>
      )}
    </div>
  );
}

export default IniciarPartida;
