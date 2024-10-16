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

function Partida() {
  const {
    partidaIniciada,
    setPartidaIniciada,
    tiempoLimite,
    jugadores,
    setJugadores,
    posicionJugador,
    setPosicionJugador,
    jugadorActualIndex,
    setJugadorActualIndex,
    jugando,
    setJugando,
    isOverlayVisible,
    partidaId
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

  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTime = sessionStorage.getItem("timeLeft");
    return storedTime !== null ? Number(storedTime) : tiempoLimite;
  });

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

  const { wsUPRef } = useContext(WebSocketContext);
  const { wsUCMRef } = useContext(WebSocketContext);

  useEffect(() => {
    try {
      wsUPRef.current.onopen = () => {
        console.log("Conexión con el WebSocket de Unirse a Partida abierta");
      };
      wsUPRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
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

  const { wsStartGameRef } = useContext(WebSocketContext);

  // Conectar al WebSocket cuando el componente se monte
    useEffect(() => {
      const partidaID = sessionStorage.getItem('partida_id');
      const identifier = sessionStorage.getItem('identifier');

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
                setPartidaIniciada(true); // Actualiza el estado cuando la partida se inicia
                empezarPartida(); // Llamar a la función para iniciar la partida
            }
        };

        // Evento cuando la conexión se cierra
        wsStartGameRef.current.onclose = () => {
            console.log("Conexión WebSocket de Iniciar Partida cerrada");
        };
      }
    }, [wsStartGameRef.current]);

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
          jugadorActual={jugadores[jugadorActualIndex]}
          jugadores={jugadores}
          onTurnoCambiado={manejarFinTurno}
          tiempoLimite={tiempoLimite}
          setTimeLeft={setTimeLeft}
          partidaId={partidaId}
        />
      </div>
      <div className="timer-container">
        {jugadores && jugadores.length > 0 && (
          <Temporizador
            tiempoLimite={tiempoLimite}
            jugadorActual={jugadores[jugadorActualIndex]?.name}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            onFinTurno={manejarFinTurno}
          />
        )}
      </div>
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
