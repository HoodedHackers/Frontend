import "./ListarPartidas.css";
import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebSocketContext } from '../../WebSocketsProvider.jsx';

function ListarPartidas() {
  const [partidas, setPartidas] = useState([]);
  const navigate = useNavigate();
  const wsLPRef = useRef(null);
  const { wsUPRef } = useContext(WebSocketContext); 


  const Unirse = async (partidaID) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/lobby/${partidaID}`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "id_game": partidaID,
          "identifier_player": sessionStorage.getItem('identifier')
        }),
      });
      if (!response.ok) {
        throw new Error('Fallo al unirse a la partida');
      }

      // Conectar al WebSocket de Unirse a Partida
      wsUPRef.current = new WebSocket(`http://127.0.0.1:8000/ws/lobby/${partidaID}`);

      // Manejar la conexión abierta
      wsUPRef.current.onopen = () => {
        console.log("Conexión WebSocket de Unirse a Partida abierta");

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
      const response = await fetch('http://127.0.0.1:8000/api/lobby', { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('No se pudo obtener las partidas');
      }
      const data = await response.json();
      console.log("Partidas recibidas del back:", data); // BORRAR
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
    wsLPRef.current = new WebSocket("http://127.0.0.1:8000/ws/api/lobby");

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


  return (
    <div>
      {partidas.length === 0 ? (
        <p className="texto-centrado">No hay partidas disponibles en este momento. Por favor, intente crear una partida.</p>
      ) : (
        <ul role="list" className="contenedor-lista">
          {partidas.map((partida) => (
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
