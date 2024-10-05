import React, { useState, useContext } from "react";
import { PartidaContext, PartidaProvider } from './PartidaProvider.jsx';
import Jugador from "./Jugador/Jugador.jsx";
import ContainerCartasMovimiento from "./CartaMovimiento/ContainerCartasMovimiento.jsx";
import TableroContainer from "./Tablero/TableroContainer.jsx";
import MazoCartaFigura from "./CartaFigura/MazoCartaFigura.jsx";
import IniciarPartida from "./IniciarPartida/IniciarPartida.jsx";
import AbandonarPartida from "./AbandonarPartida/AbandonarPartida.jsx";
import PasarTurno from "./PasarTurno/PasarTurno.jsx";
import Temporizador from "./Temporizador/Temporizador.jsx";
import "./Partida.css"; 

function Partida() {
  const {
    tiempoLimite,
    jugadores,
    jugadorActual,
    partidaIniciada,
    timeLeft,
    setTimeLeft,
    manejarFinTurno,
    manejarInicioPartida,
    isOverlayVisible,
    handleMouseEnter,
    handleMouseLeave
  } = useContext(PartidaContext);

  return (
    <div className="container-partida">
      {jugadores.map((jugador, index) => (
        <div key={jugador.id}>
          <Jugador nombre={jugador.name} ubicacion={`jugador${index + 1}`} />
          <ContainerCartasMovimiento
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
      <div >
        <MazoCartaFigura />
      </div>
      <div>
      {!partidaIniciada && <IniciarPartida onIniciar={manejarInicioPartida} />}
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
