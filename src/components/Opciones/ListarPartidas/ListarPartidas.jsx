import "./ListarPartidas.css";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function ListarPartidas() {
  const [partidas, setPartidas] = useState([]);
  const navigate = useNavigate();
  const wsRef = useRef(null);

  const Unirse = async (partida_id) => {
    try {
      const payload = {
        "id_game": partida_id,
        "identifier_player": localStorage.getItem('player_id')
      };
      console.log("Datos a enviar al backend:", payload);
      const response = await fetch(`http://127.0.0.1:8000/api/lobby/${partida_id}`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "id_game": partida_id,
          "identifier_player": localStorage.getItem('player_id')
        }),
      });
      if (!response.ok) {
        throw new Error('Fallo al unirse a la partida');
      }
      navigate(`/Partida/${partida_id}`);
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
    wsRef.current = new WebSocket("http://127.0.0.1:8000/ws/api/lobby");

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    wsRef.current.onmessage = (event) => {
      console.log("Received message:", event.data);
      const updatedMessage = JSON.parse(event.data);
      if (updatedMessage.message === "update") {
        fetchPartidas();
      }
    };

    // Manejar errores
    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Manejar cierre de conexión
    wsRef.current.onclose = function () {
      console.log("WebSocket closed");
    };

    // Cleanup cuando el componente se desmonta
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
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
