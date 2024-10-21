import React, { useContext, useEffect, useState } from "react";
import { PartidaContext, PartidaProvider } from './PartidaProvider.jsx';
import Jugador from "./Jugador/Jugador.jsx";
import { CartasMovimientoMano } from "./CartasMovimiento/CartasMovimientoMano.jsx";
import TableroWithProvider from "./Tablero/TableroContainer.jsx";
import MazoCartaFigura from "./CartaFigura/MazoCartaFigura.jsx";
import IniciarPartida from "./IniciarPartida/IniciarPartida.jsx";
import AbandonarPartida from "./AbandonarPartida/AbandonarPartida.jsx";
import PasarTurno from "./PasarTurno/PasarTurno.jsx";
import Temporizador from "./Temporizador/Temporizador.jsx";
import { WebSocketContext } from '../WebSocketsProvider.jsx';
import "./Partida.css";
import { useNavigate } from "react-router-dom";
import { set } from "react-hook-form";

function Partida() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const {
    partidaIniciada,
    setPartidaIniciada,
    tiempoLimite,
    setJugadores,
    jugadores = [], // Agrega una inicialización vacía aquí
    posicionJugador,
    setPosicionJugador,
    jugadorActualIndex,
    setJugadorActualIndex,
    jugando,
    setJugando,
    isOverlayVisible,
    jugadorActualId,
    setJugadorActualId,
    cartaMovimientoActualId,
    setCartaMovimientoActualId
  } = useContext(PartidaContext);

  useEffect(() => {
    const jugadoresParseados = JSON.parse(sessionStorage.getItem("players"));
    if (jugadoresParseados && Array.isArray(jugadoresParseados)) {
      setJugadores(jugadoresParseados);
      console.log("Jugadores actuales:", jugadoresParseados);
    } else {
      setJugadores([]);  // Asegura que jugadores sea un array vacío
    }
  }, [sessionStorage.getItem("players")]);

  const partidaID = sessionStorage.getItem('partida_id');
  const identifier = sessionStorage.getItem('identifier');
  const player_id = parseInt(sessionStorage.getItem("player_id"));
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTime = sessionStorage.getItem("timeLeft");
    return storedTime !== null ? Number(storedTime) : tiempoLimite;
  });
	const [activePlayer, setActivePlayer] = useState({});
  const name = sessionStorage.getItem('player_nickname');

  const manejarFinTurno = async () => {
    if (jugadores.length > 0) {  // Asegura que jugadores exista antes de acceder
      const nuevoIndex = (posicionJugador + 1) % jugadores.length;
      setJugadorActualIndex(nuevoIndex);
      setPosicionJugador(nuevoIndex);
      sessionStorage.setItem("posicion_jugador", nuevoIndex);
      setTimeLeft(tiempoLimite);
      sessionStorage.setItem("timeLeft", tiempoLimite);

      setJugando(false);
    }
  };

  useEffect(() => {
    sessionStorage.setItem("timeLeft", timeLeft);
  }, [timeLeft]);

  const { wsUPRef, wsStartGameRef, wsTRef, wsUCMRef } = useContext(WebSocketContext);

  useEffect(() => {
    try {
      wsUPRef.current.onopen = () => {
        console.log("Conexión con el WebSocket de Unirse a Partida abierta");
      };
      wsUPRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Mensaje recibido del WebSocket de Unirse a Partida:", data);
        if (data.response === player_id) {
          setModalMessage(`¡Felicitaciones ${name} Ganaste el juego!`);
          setShowModal(true);
        }
        if (data === 'el host ha abandonado la partida') {
          setModalMessage('El host ha abandonado la partida. Serás redirigido.');
          setShowModal(true);
        }
        if (data.players && Array.isArray(data.players)) {
          setJugadores(data.players);
          sessionStorage.setItem("players", JSON.stringify(data.players || []));
          console.log("Jugadores recibidos del WebSocket de Unirse a Partida");
        }
      };
      wsUPRef.current.onerror = (error) => {
        console.error("Error en el WebSocket de Unirse a Partida:", error);
      };
      wsUPRef.current.onclose = () => {
        console.log("Conexión WebSocket de Unirse a Partida cerrada por el servidor");
      };
    } catch (error) {
      console.error(error);
      if (wsUPRef.current) {
        wsUPRef.current.close();
        wsUPRef.current = null;
        console.log("WebSocket de Unirse a Partida cerrado");
      }
    }
  }, [wsUPRef.current]);


  function empezarPartida() {
    const jugadores = JSON.parse(sessionStorage.getItem("players"));
    if (jugadores && Array.isArray(jugadores)) {
      const posicionJugador = jugadores.findIndex(jugador => jugador.player_id === parseInt(sessionStorage.getItem("player_id"), 10));
      setPosicionJugador(posicionJugador);
      if (posicionJugador !== -1) {
        let jugadoresAux = jugadores[0];
        jugadores[0] = jugadores[posicionJugador];
        jugadores[posicionJugador] = jugadoresAux;
        sessionStorage.setItem("players", JSON.stringify(jugadores));
        sessionStorage.setItem('partidaIniciada', "true");
        setPartidaIniciada(true);
        console.log("Partida iniciada");
      } else {
        console.log("Jugador no encontrado");
        sessionStorage.removeItem("players");
      }
    }
  }

  // Conectar al WebSocket cuando el componente se monte
    useEffect(() => {
      if (wsStartGameRef.current && wsStartGameRef.current.readyState !== WebSocket.CLOSED) {
        return;
      }

      try {
        if (partidaID && identifier) {
          // Inicializar el WebSocket
          const player_id = parseInt(sessionStorage.getItem("player_id"), 10);
          wsStartGameRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/lobby/${partidaID}/status?player_id=${player_id}`);
  
          // Evento cuando se abre la conexión
          wsStartGameRef.current.onopen = () => {
              console.log("Conectado al WebSocket de Iniciar Partida de estado de partida");
          };
  
          // Evento cuando se recibe un mensaje del WebSocket
          wsStartGameRef.current.onmessage = (event) => {
              const message = JSON.parse(event.data);
              console.log("Mensaje recibido:", message);
              if (message.status === "started") {
                  empezarPartida(); // Llamar a la función para iniciar la partida
              }
          };
  
          // Evento cuando la conexión se cierra
          wsStartGameRef.current.onclose = () => {
              console.log("Conexión WebSocket de Iniciar Partida cerrada");
          };
        }
      } catch (error) {
        console.error("Error al conectar al WebSocket de Iniciar Partida:", error);
      }
    }, [wsStartGameRef.current]);

// Conectar al WebSocket de Usar Carta de Movimiento
  useEffect(() => {
    if (wsUCMRef.current && wsUCMRef.current.readyState !== WebSocket.CLOSED) {
      return;
    }

    try {
      wsUCMRef.current = new WebSocket(
        `ws://127.0.0.1:8000/ws/lobby/${partidaID}/select?player_id=${player_id}`,
      );

      wsUCMRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        sessionStorage.setItem("jugadorActualId", data.player_id);
        setJugadorActualId(data.player_id);
        sessionStorage.setItem("cartaMovimientoActualId", data.card_id);
        setCartaMovimientoActualId(data.card_id);
        console.log("Mensaje recibido del WebSocket de Usar Carta de Movimiento:", data);
      }

      // Manejar apertura del WebSocket
      wsUCMRef.current.onopen = () => {
        console.log("WebSocket de Usar Carta de Movimiento conectado.");
      };

      // Manejar errores
      wsUCMRef.current.onerror = (error) => {
        console.error("Error en WebSocket de Usar Carta de Movimiento:", error);
        wsUCMRef.current = null; // Resetear la referencia si falla la conexión
      };

    } catch (error) {
      console.error("Error al conectar al WebSocket de Usar Carta de Movimiento:", error);
    }
  }, [wsUCMRef.current]);


	useEffect(() => {
		wsTRef.current = new WebSocket(`ws://localhost:8000/ws/lobby/${partidaID}/turns?player_id=${player_id}`);

		wsTRef.current.onopen = () => {
			wsTRef.current.send(JSON.stringify({request: "status"}))
		};

		wsTRef.current.onmessage = (event) => {
			console.log("Received message:", event.data);
			const updatedMessage = JSON.parse(event.data);
			setActivePlayer({player_name: updatedMessage.player_name, player_id: updatedMessage.player_id});
		};
	}, [player_id, partidaID, wsTRef]);

  /*useEffect(() => {
    const partidaID = sessionStorage.getItem('partida_id'); // Obtén el ID de la partida

    const handleStorageChange = (event) => {
        if (event.key === `hostAbandono_partida_${partidaID}` && event.newValue === 'true') {
          setModalMessage('El host ha abandonado la partida. Serás redirigido.');
          setShowModal(true);  // Mostrar el modal
          wsUPRef.current.close();
          sessionStorage.removeItem('players');
          localStorage.removeItem(`hostAbandono_partida_${partidaID}`);
          sessionStorage.removeItem('partida_id');
          sessionStorage.removeItem('isOwner');
          sessionStorage.removeItem('timeLeft');
          localStorage.removeItem(`partidaIniciada_${partidaID}`);
          sessionStorage.removeItem('partidaIniciada');
          navigate('/Opciones');
        }
    };

    // Añadir el listener para cambios en localStorage
    window.addEventListener('storage', handleStorageChange);

    return () => {
        // Limpiar el listener cuando el componente se desmonte
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const partidaID = sessionStorage.getItem('partida_id'); // Obtén el ID de la partida
    const isPartidaOn = localStorage.getItem(`partidaIniciada_${partidaID}`); // Obtén el estado de la partida

    const handleStorageChange = (event) => {
      if (event.key === `players_${partidaID}`) {
        const players = JSON.parse(localStorage.getItem(`players_${partidaID}`)); // Obtener el arreglo desde localStorage
        const isPartidaOn = localStorage.getItem(`partidaIniciada_${partidaID}`); // Obtén el estado de la partida

        if (Array.isArray(players) && players.length === 1 && isPartidaOn === 'true') {
          const playerName = players[0].player_name;
          setModalMessage(`¡Felicitaciones ${playerName} Ganaste el juego!`);
          setShowModal(true);  // Mostrar el modal
          wsUPRef.current.close();
          sessionStorage.removeItem('players');
          localStorage.removeItem(`hostAbandono_partida_${partidaID}`);
          sessionStorage.removeItem('partida_id');
          sessionStorage.removeItem('isOwner');
          sessionStorage.removeItem('timeLeft');
          localStorage.removeItem(`players_${partidaID}`);
          sessionStorage.removeItem('partidaIniciada');
          localStorage.removeItem(`partidaIniciada_${partidaID}`);
          navigate('/Opciones');
        }
      }
    };

    // Añadir el listener para cambios en localStorage
    window.addEventListener('storage', handleStorageChange);

    return () => {
      // Limpiar el listener cuando el componente se desmonte
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);*/

  const handleCloseModal = () => {
    const partidaID = sessionStorage.getItem('partida_id');
    wsUPRef.current.close();
    sessionStorage.removeItem('players');
    sessionStorage.removeItem('partida_id');
    sessionStorage.removeItem('isOwner');
    sessionStorage.removeItem('timeLeft');
    sessionStorage.removeItem('partidaIniciada');
    setShowModal(false);  // Cerrar el modal
    navigate('/Opciones');
  };

  return (
    <div className="container-partida">
      {Array.isArray(jugadores) && jugadores.length > 0 ? (
        jugadores.map((jugador, index) => (
          <div key={jugador.player_id}>
            <Jugador
              nombre={jugador.player_name}
              ubicacion={`jugador${index + 1}`}
            />
            <CartasMovimientoMano ubicacion={index} />
            <MazoCartaFigura ubicacion={index} />
          </div>
        ))
      ) : (
        <p>No hay jugadores en la partida.</p>
      )}
      <div className="tableroContainer">
        <TableroWithProvider />
      </div>
      <div>
        {!partidaIniciada && <IniciarPartida empezarPartida={empezarPartida} />}
      </div>
      <div className="abandonar-partida-container">
        {isOverlayVisible && <div className="overlay-supremo"></div>}
        <AbandonarPartida />
      </div>
      <div className="pasar-turno-container">
        <PasarTurno
          onTurnoCambiado={manejarFinTurno}
          tiempoLimite={tiempoLimite}
          setTimeLeft={setTimeLeft}
          disabled={activePlayer.player_id !== player_id}
        />
      </div>
      <div className="timer-container">
        {jugadores && jugadores.length > 0 && (
          <Temporizador
            tiempoLimite={tiempoLimite}
            jugadorActual={activePlayer.player_name}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            onFinTurno={manejarFinTurno}
          />
        )}
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
            </div>
            <div className="modal-body">
              <p>{modalMessage}</p>
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
      {isOverlayVisible && <div className="overlay"></div>}
    </div>
  );
}

export default function PartidaWithProvider() {
  return (
    <PartidaProvider>
      <Partida />
    </PartidaProvider>
  );
}
