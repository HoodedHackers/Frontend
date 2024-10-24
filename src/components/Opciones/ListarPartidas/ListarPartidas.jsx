import "./ListarPartidas.css";
import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebSocketContext } from '../../WebSocketsProvider.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function ListarPartidas() {
  const [partidas, setPartidas] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState(""); // Estado para almacenar el término de búsqueda por nombre
  const [filtroJugadores, setFiltroJugadores] = useState(""); // Estado para almacenar el número de jugadores
  const navigate = useNavigate();
  const { wsLPRef, wsUPRef } = useContext(WebSocketContext);


  const Unirse = async (partidaID) => {
    try {
      // Conectar al WebSocket de Unirse a Partida
      const player_id = parseInt(sessionStorage.getItem("player_id"), 10);
      wsUPRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/lobby/${partidaID}?player_id=${player_id}`);

      // Manejar la conexión abierta
      wsUPRef.current.onopen = () => {
        console.log("Conexión WebSocket de Unirse a Partida abierta.");

        const startMessage = {
          user_identifier: sessionStorage.getItem('identifier')
        };
        wsUPRef.current.send(JSON.stringify(startMessage));
        console.log("Mensaje unión a partida enviado.");
      };

      // Manejar el arreglo de jugadores actualziado recibido como respuesta
      wsUPRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        sessionStorage.setItem("players", JSON.stringify(data.players));
      };

      // Manejar errores
      wsUPRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      sessionStorage.setItem("partida_id", partidaID);

      sessionStorage.setItem('isOwner', false);

      // Navegar a la partida
      setTimeout(() => {
        navigate(`/Partida/${partidaID}`);
      }, 500);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchPartidas = async () => {
    try {
      let params = {};

      // Agregar filtro por nombre si está presente
      if (filtroNombre) {
        params.name = filtroNombre;
      }

      if (filtroJugadores) {
        const numJugadores = parseInt(filtroJugadores);
        if (!isNaN(numJugadores)) {
          params.max_players = numJugadores;
        }
      }

      params.limit = 100;

      // Convertir los parámetros a una cadena de consulta
      let query = new URLSearchParams(params).toString();

      // Enviar la solicitud fetch
      const response = await fetch('http://127.0.0.1:8000/api/lobby?' + query, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo obtener las partidas.');
      }

      const data = await response.json();
      setPartidas(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch inicial
    fetchPartidas();
    
  }, []);


  useEffect(() => {
    wsLPRef.current = new WebSocket("ws://127.0.0.1:8000/ws/api/lobby");

    wsLPRef.current.onopen = () => {
      console.log("WebSocket de Listar Partida conectado");
    };

    wsLPRef.current.onmessage = (event) => {
      console.log("Received message:", event.data);
      const updatedMessage = JSON.parse(event.data);
      if (updatedMessage.message === "update") {
        fetchPartidas();
      }
    };

    // Manejar errores
    wsLPRef.current.onerror = (error) => {
      console.error("WebSocket Listar Partida error:", error);
    };

    // Manejar cierre de conexión
    wsLPRef.current.onclose = function () {
      console.log("WebSocket de Listar Partida cerrado");
    };

    // Cleanup cuando el componente se desmonta
    return () => {
      if (wsLPRef.current) {
        wsLPRef.current.close();
      }
    };
  }, []);

// Filtrar las partidas por el término de búsqueda por nombre y cantidad mínima de jugadores
const partidasFiltradas = partidas.filter((partida) =>
  partida.name.toLowerCase().startsWith(filtroNombre.toLowerCase()) && // Cambiado a startsWith
  (filtroJugadores === "" || partida.current_players >= parseInt(filtroJugadores)) &&
  partida.current_players < partida.max_players 
);

  return (
    <div className="buscador-container">
      <div style={{ display: "flex", gap: "20px" }}>
        <div className="buscador-con-lupa">
          <input
            type="text"
            placeholder="Buscar por nombre de partida..."
            className="campo-busqueda"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} className="icono-lupa" />
        </div>

        <div className="buscadorjugadores">
          <select
            className="campo-busqueda"
            value={filtroJugadores}
            onChange={(e) => setFiltroJugadores(e.target.value)}
          >
            <option value="">Buscar por cantidad de jugadores...</option>
            <option value="1">1 jugador</option>
            <option value="2">2 jugadores</option>
            <option value="3">3 jugadores</option>
          </select>

        </div>
      </div>

      {partidasFiltradas.length === 0 ? (
        <p className="texto-centrado">No se encontraron partidas, pruebe con otro nombre o número de jugadores.</p>
      ) : (
        <ul role="list" className="contenedor-lista">
          {partidasFiltradas.map((partida) => (
            <li key={partida.id} className="item-partida" role="listitem">
              <div className="list-item-izq">
                <p className="item-partida-nombre">{partida.name}</p>
                <p className="item-partida-jugadores">
                  <b>Jugadores:</b> {partida.current_players}/{partida.max_players}
                </p>
              </div>
              <div className="item-partida-der">
                <button
                  className="item-partida-boton"
                  onClick={() => Unirse(partida.id)}
                >
                  Unirse
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>

  );
}

export default ListarPartidas;