import React, { useEffect } from "react";
import Jugador from "./jugador/jugador.jsx";
import ContainerCartasMovimiento from "./carta_movimiento/container_cartas_movimiento.jsx";
import Tablero_Container from "./tablero/tablero_container.jsx";
import Mazo_Carta_Figura from "./carta_figura/mazo_carta_figura.jsx";
import Abandonar_Partida from "./abandonar_partida/abandonar_partida.jsx";
import Pasar_Turno from "./pasar_turno/pasar_turno.jsx";
import Temporizador from "./temporizador/temporizador.jsx";
import "./Partida.css"; 

function Partida() {
  const tiempoLimite = 120; // 2 minutos
  const [jugadores, setJugadores] = React.useState([
    { id: 1, name: "Jugador1" },
    { id: 2, name: "Jugador2" },
    { id: 3, name: "Jugador3" },
    { id: 4, name: "Jugador4" }
  ]);


  const [jugadorActualIndex, setJugadorActualIndex] = React.useState(() => {
    const storedIndex = localStorage.getItem("jugadorActualIndex");
    return storedIndex !== null ? Number(storedIndex) : 0;
  });
  
  const jugadorActual = jugadores[jugadorActualIndex]; // Obtener el jugador actual
  const [timeLeft, setTimeLeft] = React.useState(() => {
    const storedTime = localStorage.getItem("timeLeft");
    return storedTime !== null ? Number(storedTime) : tiempoLimite; // Usar el tiempo almacenado o el límite inicial
  }); 
  
  const [partidaIniciada, setPartidaIniciada] = React.useState(() => {
    const storedPartidaIniciada = localStorage.getItem("partidaIniciada");
    return storedPartidaIniciada === "true"; // Convertir a booleano
  }); // Estado para el inicio de la partida

  // Estado para manejar si el overlay debe mostrarse
  const [isOverlayVisible, setIsOverlayVisible] = React.useState(false);
  
  // Funciones para manejar el mouse sobre las cartas
  const handleMouseEnter = () => {
    setIsOverlayVisible(true);
  };
  
  const handleMouseLeave = () => {
    setIsOverlayVisible(false);
  };

  const manejarFinTurno = async () => {
    const nuevoIndex = (jugadorActualIndex + 1) % jugadores.length;
    setJugadorActualIndex(nuevoIndex);
    localStorage.setItem("jugadorActualIndex", nuevoIndex); // Guarda el nuevo índice en localStorage

    // Reiniciar el temporizador y guardarlo en localStorage
    setTimeLeft(tiempoLimite);
    localStorage.setItem("timeLeft", tiempoLimite); // Guardar el tiempo inicial

    // Enviar actualización del turno al backend
    try {
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jugadorActualIndex: nuevoIndex }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el turno en el servidor");
      }
    } catch (error) {
      console.error("Error en la conexión al servidor:", error);
    }
  };

  // Callback para iniciar la partida
  const manejarInicioPartida = () => {
    setPartidaIniciada(true);
    localStorage.setItem("partidaIniciada", "true"); // Guardar el estado en localStorage
  };

  useEffect(() => {
    // Guardar el tiempo restante en localStorage cada vez que cambie
    localStorage.setItem("timeLeft", timeLeft);
  }, [timeLeft]);

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
          <Mazo_Carta_Figura
            ubicacion={index}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      ))}
      <div className="tableroContainer">
        <Tablero_Container jugadores={[]} />
      </div>
      <div >
        <Mazo_Carta_Figura />
      </div>
      <div className="abandonar-partida-container">
        <Abandonar_Partida />
      </div>
      <div className="pasar-turno-container">
        <Pasar_Turno
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
          timeLeft={timeLeft} // Pasar el tiempo restante al temporizador
          setTimeLeft={setTimeLeft} // Pasar la función para actualizar el tiempo
          onFinTurno={manejarFinTurno}
        />
      </div>
      {isOverlayVisible && <div className="overlay"></div>}
    </div>
  );
}

export default Partida;
