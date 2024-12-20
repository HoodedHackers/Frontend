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
import Chat from "./Chat/Chat.jsx";
import { WebSocketContext } from '../WebSocketsProvider.jsx';
import CancelarMovimientos from "./CancelarMovimiento/CancelarMovimientos.jsx";
import "./Partida.css";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';


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
    jugadores,
    setJugadores,
    posicionJugador,
    setPosicionJugador,
    setJugadorActualIndex,
    isOverlayVisible,
    setJugandoMov,
    setSeleccionadaMov,
    setJugandoFig,
    setSeleccionadaFig,
    setJugadorActualId,
    setCartaMovimientoActualId,
    setCartaMovimientoActualIndex,
    setCantidadCartasMovimientoJugadorActual,
    cartasDelJugador,
    setCartasDelJugador,
    setMazo,
    activePlayer,
    setActivePlayer,
    cartasBloqueadas,
    setCartasBloqueadas
  } = useContext(PartidaContext);

  const { 
    wsUPRef,
    wsStartGameRef,
    wsTRef,
    wsUCMRef,
    wsCFRef,
    wsTimerRef,
    wsCRef 
  } = useContext(WebSocketContext);

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

  useEffect(() => {
    if(partidaIniciada && activePlayer.player_id === player_id) {
      wsCRef.current.send(JSON.stringify({message: `Turno de ${activePlayer.player_name}.`}));
    }
  }, [activePlayer]);

  const partidaID = sessionStorage.getItem('partida_id');
  const identifier = sessionStorage.getItem('identifier');
  const player_id = parseInt(sessionStorage.getItem("player_id"));
  const [time, setTime] = useState(-1.0);
  const name = sessionStorage.getItem('player_nickname');

  const manejarFinTurno = async () => {
    if (jugadores.length > 0) {  // Asegura que jugadores exista antes de acceder
      const nuevoIndex = (posicionJugador + 1) % jugadores.length;
      setJugadorActualIndex(nuevoIndex);
      setPosicionJugador(nuevoIndex);
      sessionStorage.setItem("posicion_jugador", nuevoIndex);
      setTime(tiempoLimite);
      sessionStorage.setItem("timeLeft", tiempoLimite);
      setJugandoMov(false);
    }
  };

  function reorderPlayers(players) {
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

  useEffect(() => {
    try {
      wsUPRef.current.onopen = () => {
        console.log("Conexión con el WebSocket de Unirse a Partida abierta");
      };
      wsUPRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Mensaje recibido del WebSocket de Unirse a Partida:", data);
        if (data.winner) {
          setModalMessage(`¡Felicitaciones ${data.winner}, has ganado el juego!`);
          setShowModal(true);
        }
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
      wsTRef.current.send(JSON.stringify({ request: "status" }))
    };

    wsTRef.current.onmessage = (event) => {
      console.log("Received message:", event.data);
      const updatedMessage = JSON.parse(event.data);
      setActivePlayer({ player_name: updatedMessage.player_name, player_id: updatedMessage.player_id });
      sessionStorage.setItem("cantidadCartasMovimientoJugadorActual", 3);
      setCantidadCartasMovimientoJugadorActual(3);
      sessionStorage.setItem("cartaMovimientoActualId", -1);
      setCartaMovimientoActualId(-1);
      setSeleccionadaMov({});
      setJugandoMov(false);
      setSeleccionadaFig({});
      setJugandoFig(false);
    };
  }, [player_id, partidaID, wsTRef]);

  useEffect(() => {
    if (wsCFRef.current && wsCFRef.current.readyState !== WebSocket.CLOSED) {
      return;
    }
    try {
      // Crear la conexión WebSocket
      wsCFRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/lobby/${partidaID}/figs?player_id=${player_id}`);

      // Manejar mensajes recibidos del WebSocket
      wsCFRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Mensaje recibido por ws de cartas figura:', data);
        if (data.id_card_unlock){
          sessionStorage.setItem("cartasBloqueadas", JSON.stringify(cartasBloqueadas.filter(id => id !== data.id_card_unlock)));
          setCartasBloqueadas(prevCartasBloqueadas => 
            prevCartasBloqueadas.filter(id => id !== data.id_card_unlock)
          );
        }
        sessionStorage.setItem("cartasBloqueadas", JSON.stringify([...cartasBloqueadas, data.id_card_block]));
        data.id_card_block !== undefined && setCartasBloqueadas(prevCartasBloqueadas => [...prevCartasBloqueadas, data.id_card_block]);
        sessionStorage.setItem("mazo", JSON.stringify(data.players));
        setMazo(data.players);
        sessionStorage.setItem("cartaMovimientoActualId", -1);
        setCartaMovimientoActualId(-1);
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
    wsUPRef.current.close();
    sessionStorage.removeItem('players');
    sessionStorage.removeItem('partida_id');
    sessionStorage.removeItem('isOwner');
    sessionStorage.removeItem('timeLeft');
    sessionStorage.removeItem('partidaIniciada');
    setShowModal(false); 
    navigate('/Opciones');
  };

  function empezarPartida() {
    sessionStorage.setItem('partidaIniciada', "true");
    setPartidaIniciada(true);
    reorderPlayers(JSON.parse(sessionStorage.getItem("players")));
    console.log("Partida iniciada");
  }


  return (
    <div className="partida-con-chat">
      <div className="contenedor-chat">
        <Chat />
      </div>
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
            disabled={activePlayer.player_id !== player_id}
          />
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
