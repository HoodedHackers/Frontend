import React, { useContext } from "react";
import { PartidaContext, PartidaProvider } from './PartidaProvider.jsx';
import Jugador from "./Jugador/Jugador.jsx";
import CartasMovimientoMano from "./CartasMovimiento/CartasMovimientoMano.jsx";
import TableroContainer from "./Tablero/TableroContainer.jsx";
import MazoCartaFigura from "./CartaFigura/MazoCartaFigura.jsx";
import IniciarPartida from "./IniciarPartida/IniciarPartida.jsx";
import AbandonarPartida from "./AbandonarPartida/AbandonarPartida.jsx";
import PasarTurno from "./PasarTurno/PasarTurno.jsx";
import Temporizador from "./temporizador/temporizador.jsx";
import "./Partida.css"; 

function Partida() {
  const {
    partidaIniciada,
    tiempoLimite,
    jugadores,
    jugadorActual,
    timeLeft,
    setTimeLeft,
    manejarFinTurno,
    isOverlayVisible,
    handleMouseEnter,
    handleMouseLeave
  } = useContext(PartidaContext);

  return (
    <div className="container-partida">
      {jugadores.map((jugador, index) => (
        <div key={jugador.id}>
          <Jugador 
            nombre={jugador.name} 
            ubicacion={`jugador${index + 1}`}  
          />
          <CartasMovimientoMano
            ubicacion={index}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave} 
          />
          <MazoCartaFigura
            ubicacion={index}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      ))}
      <div className="tableroContainer">
        <TableroContainer jugadores={[]} />
      </div>
      <div>
        {!partidaIniciada && <IniciarPartida />}
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
      <div className="timer-container">
        <Temporizador
          tiempoLimite={tiempoLimite}
          jugadorActual={jugadorActual.name}
          timeLeft={timeLeft} // Pasar el tiempo restante al Temporizador
          setTimeLeft={setTimeLeft} // Pasar la función para actualizar el tiempo
          onFinTurno={manejarFinTurno}
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
