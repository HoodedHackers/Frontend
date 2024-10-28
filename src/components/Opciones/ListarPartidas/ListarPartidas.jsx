import "./ListarPartidas.css";
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebSocketContext } from '../../WebSocketsProvider.jsx';

function ListarPartidas() {
  const [partidas, setPartidas] = useState([]);
  const navigate = useNavigate();
  const { wsLPRef, wsUPRef } = useContext(WebSocketContext);

  const Unirse = async (partida) => {
    try {
      const player_id = parseInt(sessionStorage.getItem("player_id"), 10);
      let password = null;

      // Si la partida es privada, solicita la contraseña
      if (partida.is_private) {
        password = prompt("La partida es privada. Ingrese la contraseña:");
        if (!password) {
          alert("Debe ingresar una contraseña.");
          return;
        }
      }

      // Conectar al WebSocket de Unirse a Partida
      wsUPRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/lobby/${partida.id}?player_id=${player_id}`);

      wsUPRef.current.onopen = () => {
        console.log("Conexión WebSocket de Unirse a Partida abierta.");

        const startMessage = {
          user_identifier: sessionStorage.getItem('identifier'),
          password: password // Enviar la contraseña si es partida privada
        };
        wsUPRef.current.send(JSON.stringify(startMessage));
        console.log("Mensaje unión a partida enviado.");
      };

      wsUPRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.error) {
          alert("Contraseña incorrecta o error al unirse a la partida.");
          return;
        }
        sessionStorage.setItem("players", JSON.stringify(data.players));
        sessionStorage.setItem("partida_id", partida.id);
        sessionStorage.setItem('isOwner', false);

        setTimeout(() => {
          navigate(`/Partida/${partida.id}`);
        }, 1000);
      };

      wsUPRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

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
        throw new Error('No se pudo obtener las partidas.');
      }
      const data = await response.json();
      setPartidas(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPartidas();
  }, []);

  useEffect(() => {
    wsLPRef.current = new WebSocket("ws://127.0.0.1:8000/ws/api/lobby");

    wsLPRef.current.onopen = () => {
      console.log("WebSocket de Listar Partida conectado");
    };

    wsLPRef.current.onmessage = (event) => {
      const updatedMessage = JSON.parse(event.data);
      if (updatedMessage.message === "update") {
        fetchPartidas();
      }
    };

    wsLPRef.current.onerror = (error) => {
      console.error("WebSocket Listar Partida error:", error);
    };

    wsLPRef.current.onclose = () => {
      console.log("WebSocket de Listar Partida cerrado");
    };

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
                <p className="item-partida-tipo">
                  <b>Tipo:</b> {partida.is_private ? 'Privada' : 'Pública'}
                </p>
              </div>
              <div className="item-partida-der">
                <button
                  className="item-partida-boton"
                  onClick={() => Unirse(partida)}
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
