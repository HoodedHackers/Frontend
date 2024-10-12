import React, { useContext, useEffect, useState } from "react";
import { PartidaContext, PartidaProvider } from './PartidaProvider.jsx';
import Jugador from "./Jugador/Jugador.jsx";
import CartasMovimientoMano from "./CartasMovimiento/CartasMovimientoMano.jsx";
import TableroContainer from "./Tablero/TableroContainer.jsx";
import MazoCartaFigura from "./CartaFigura/MazoCartaFigura.jsx";
import IniciarPartida from "./IniciarPartida/IniciarPartida.jsx";
import AbandonarPartida from "./AbandonarPartida/AbandonarPartida.jsx";
import PasarTurno from "./PasarTurno/PasarTurno.jsx";
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
    jugadorActual,
    isOverlayVisible,
  } = useContext(PartidaContext);
  
  useEffect(() => {
    const jugadoresParseados = JSON.parse(sessionStorage.getItem("players"));
    if (jugadoresParseados) {
      setJugadores(jugadoresParseados);
    }
    const partidaIniciada = sessionStorage.getItem("partidaIniciada");
    if (partidaIniciada) {
      setPartidaIniciada(true);
    }
  }, [sessionStorage.getItem("players"), sessionStorage.getItem("partidaIniciada")]);

  const [timeLeft, setTimeLeft] = useState(() => {
    const storedTime = sessionStorage.getItem("timeLeft");
    return storedTime !== null ? Number(storedTime) : tiempoLimite;
  });

  const manejarFinTurno = async () => {
    const nuevoIndex = (posicionJugador + 1) % jugadores.length;
    setJugadorActualIndex(nuevoIndex);
    sessionStorage.setItem("posicion_jugador", nuevoIndex);
    setTimeLeft(tiempoLimite);
    sessionStorage.setItem("timeLeft", tiempoLimite);

    try {
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ posicionJugador: nuevoIndex }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el turno en el servidor");
      }
    } catch (error) {
      console.error("Error en la conexión al servidor:", error);
    }
  };

  useEffect(() => {
    sessionStorage.setItem("timeLeft", timeLeft);
  }, [timeLeft]);

  const { wsUPRef } = useContext(WebSocketContext);

  // Escucha el WebSocket de Unirse a Partida
  useEffect(() => {
    try {
      wsUPRef.current.onopen = () => {
        console.log("Conexión con el WebSocket de Unirse a Partida abierta");
      };
      wsUPRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setJugadores(data.players);
        sessionStorage.setItem("players", JSON.stringify(data.players || []));
        console.log("Jugadores recibidos del WebSocket de Unirse a Partida");
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

  return (
    <div className="container-partida">
      {jugadores && jugadores.map((jugador, index) => (
        <div key={jugador.id}>
          <Jugador 
            nombre={jugador.name} 
            ubicacion={`jugador${index + 1}`}  
          />
          <CartasMovimientoMano
            ubicacion={index}
          />
          <MazoCartaFigura
            ubicacion={index}
          />
        </div>
      ))}
      <div className="tableroContainer">
        <TableroContainer jugadores={[]} />
      </div>
      <div>
        {!partidaIniciada && <IniciarPartida empezarPartida={empezarPartida} />}
      </div>
      <div className="abandonar-partida-container">
        <AbandonarPartida />
      </div>
      <div className="pasar-turno-container">
        <PasarTurno
          jugadorActual={jugadorActual}
          jugadores={jugadores}
          onTurnoCambiado={manejarFinTurno}
          tiempoLimite={tiempoLimite}
          setTimeLeft={setTimeLeft}
        />
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
