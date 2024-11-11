import React, { useContext, useEffect, useState, useRef } from "react";
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
import CancelarMovimientos from "./CancelarMovimiento/CancelarMovimientos.jsx";
import "./Partida.css";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { set } from "react-hook-form";


function Partida() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  const {
    partidaIniciada,
    setPartidaIniciada,
    tiempoLimite,
    setJugadores,
    jugadores,
    posicionJugador,
    setPosicionJugador,
    setJugadorActualIndex,
    setJugando,
    isOverlayVisible,
    setSeleccionada,
    setJugadorActualId,
    setCartaMovimientoActualId,
    setCartaMovimientoActualIndex,
    setCantidadCartasMovimientoJugadorActual,
    cartasDelJugador,
    setCartasDelJugador,
    setMazo,
    colorBloqueadoRGB,
  } = useContext(PartidaContext);

  useEffect(() => {
    const jugadoresParseados = JSON.parse(sessionStorage.getItem("players"));
    if (jugadoresParseados && Array.isArray(jugadoresParseados)) {
      if (partidaIniciada) {
        const jugadoresOrdenados = reorderPlayers(jugadoresParseados);
        setJugadores(jugadoresOrdenados);
        sessionStorage.setItem("players", JSON.stringify(jugadoresOrdenados));
      }
      else {
        setJugadores(jugadoresParseados);
        sessionStorage.setItem("players", JSON.stringify(jugadoresParseados));
      }
    } else {
      setJugadores([]);  // Asegura que jugadores sea un array vacío
    }
  }, [sessionStorage.getItem("players")]);

  const partidaID = sessionStorage.getItem('partida_id');
  const identifier = sessionStorage.getItem('identifier');
  const player_id = parseInt(sessionStorage.getItem("player_id"));
  const [time, setTime] = useState(-1.0);
	const [activePlayer, setActivePlayer] = useState({});
  const name = sessionStorage.getItem('player_nickname');

  const manejarFinTurno = async () => {
    if (jugadores.length > 0) {  // Asegura que jugadores exista antes de acceder
      const nuevoIndex = (posicionJugador + 1) % jugadores.length;
      setJugadorActualIndex(nuevoIndex);
      setPosicionJugador(nuevoIndex);
      sessionStorage.setItem("posicion_jugador", nuevoIndex);
      setTime(tiempoLimite);
      sessionStorage.setItem("timeLeft", tiempoLimite);
      setJugando(false);
    }
  };

  function reorderPlayers (players) {
    if (players && Array.isArray(players)) {
      const posicionJugador = players.findIndex(jugador => jugador.player_id === parseInt(sessionStorage.getItem("player_id"), 10));
      setPosicionJugador(posicionJugador);
      if (posicionJugador !== -1) {
        let playersAux = players[0];
        players[0] = players[posicionJugador];
        players[posicionJugador] = playersAux;
        sessionStorage.setItem("players", JSON.stringify(players));
      } else {
        console.log("Jugador no encontrado");
        players = [];
        sessionStorage.removeItem("players");
      }
      return players;
    }
    return null;
  }

  const { wsUPRef, wsStartGameRef, wsTRef, wsUCMRef, wsCFRef, wsTimerRef } = useContext(WebSocketContext);

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
            sessionStorage.setItem("players", JSON.stringify(data.players) || []);
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

  useEffect(() => {
    if (partidaIniciada && audioRef.current) {
      if (!isMuted) {
        audioRef.current.play().catch(error => {
          console.error("Error al reproducir el audio:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }

    // Detener el audio cuando el componente se desmonta o la partida termina
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reiniciar el audio
      }
    };
  }, [partidaIniciada, isMuted]); // Se activa cuando la partida inicia o el estado mute cambia

  // Maneja el click del botón de mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

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
        `ws://127.0.0.1:8000/ws/lobby/${partidaID}/movement_cards?player_UUID=${identifier}`,
      );

      wsUCMRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.action) {
          case "deal":
            sessionStorage.setItem("cartas_mov", JSON.stringify(data.card_mov));
            setCartasDelJugador(data.card_mov);
            sessionStorage.setItem("cantidadCartasMovimientoJugadorActual", cartasDelJugador.length);
            setCantidadCartasMovimientoJugadorActual(cartasDelJugador.length);
          break;

          case "select":
            sessionStorage.setItem("jugadorActualId", data.player_id);
            setJugadorActualId(data.player_id);
            sessionStorage.setItem("cartaMovimientoActualId", data.card_id);
            setCartaMovimientoActualId(data.card_id);
            sessionStorage.setItem("cartaMovimientoActualIndex", data.index);
            setCartaMovimientoActualIndex(data.index);
          break;

          case "use_card":
          case "recover_card":
            sessionStorage.setItem("jugadorActualId", data.player_id);
            setJugadorActualId(data.player_id);
            sessionStorage.setItem("cantidadCartasMovimientoJugadorActual", data.len);
            setCantidadCartasMovimientoJugadorActual(data.len);
            sessionStorage.setItem("cartaMovimientoActualId", -1);
            setCartaMovimientoActualId(-1);
          break;

          default:
            throw new Error("Acción no reconocida: ", data.action);
        }
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
      sessionStorage.setItem("cantidadCartasMovimientoJugadorActual", 3);
      setCantidadCartasMovimientoJugadorActual(3);
      sessionStorage.setItem("cartaMovimientoActualId", -1);
      setCartaMovimientoActualId(-1);
      setSeleccionada(false);
      setJugando(false);
		};
	}, [player_id, partidaID, wsTRef]);

  useEffect(() => {
    if (wsCFRef.current && wsCFRef.current.readyState !== WebSocket.CLOSED) {
      return;
    }
    try {
      // Crear la conexión WebSocket
      wsCFRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/lobby/${partidaID}/figs?player_id=${player_id}`);

      /*wsCFRef.current.onopen = () => {
        wsCFRef.current.send(JSON.stringify({ receive: 'cards'}));
      };*/

      // Manejar mensajes recibidos del WebSocket
      wsCFRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMazo(data.players);
      };

      // Manejar errores en la conexión
      wsCFRef.current.onerror = (error) => {
        console.error('Error en WebSocket:', error);
      };

      // Manejar la desconexión del WebSocket
      wsCFRef.current.onclose = () => {
        console.log('Conexión WebSocket cerrada');
      };

    } catch (error) {
      console.error('Error al conectar con el WebSocket:', error);
    }
  }, [wsCFRef.current/*, partidaIniciada, jugadorActualIndex*/]);


  // Temporizador
  useEffect(() => {
    wsTimerRef.current = new WebSocket(`http://127.0.0.1:8000/ws/timer?player_id=${player_id}&game_id=${partidaID}`);

    wsTimerRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTime(data.time);
    };

    wsTimerRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, [player_id, partidaID, wsTimerRef]);

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

  function empezarPartida() {
    sessionStorage.setItem('partidaIniciada', "true");
    setPartidaIniciada(true);
    reorderPlayers(JSON.parse(sessionStorage.getItem("players")));
    console.log("Partida iniciada");
  }


  return (
    <div className="container-partida">
        {/* El elemento <audio> para la música de fondo */}
    <audio ref={audioRef} loop>
        <source src="/Hollow Knight OST - Crystal Peak.mp3" type="audio/mpeg" />
        Tu navegador no soporta el audio.
      </audio>

      {/* Botón de mute */}
      <button onClick={toggleMute} className="mute-button">
  <i className={isMuted ? "fas fa-volume-mute" : "fas fa-volume-up"}></i>
</button>


      {Array.isArray(jugadores) && jugadores.length > 0 ? (
        jugadores.map((jugador, index) => (
          <div key={jugador.player_id}>
            <Jugador
              nombre={jugador.player_name}
              ubicacion={`jugador${index + 1}`}
            />
            <CartasMovimientoMano ubicacion={index} jugadorId={jugador.player_id} />
            <MazoCartaFigura ubicacion={index} />
          </div>
        ))
      ) : (
        <p>No hay jugadores en la partida.</p>
      )}
      <div className="tableroContainer">
        <TableroWithProvider />
      </div>
      <div className="cancelar-movimientos-container">
        <CancelarMovimientos
        jugadorActual={activePlayer.player_name} />
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
          setTimeLeft={setTime}
          disabled={activePlayer.player_id !== player_id}
        />
      </div>
      <div className="timer-container">
        {jugadores && jugadores.length > 0 && time > -1.0 && (
          <Temporizador
            currentPlayer={activePlayer.player_name}
            time={time}
            color={colorBloqueadoRGB}
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
