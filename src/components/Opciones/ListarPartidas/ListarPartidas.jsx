import "./ListarPartidas.css";
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebSocketContext } from '../../WebSocketsProvider.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function ListarPartidas() {
  const [partidas, setPartidas] = useState([]);
  const [passwordInputs, setPasswordInputs] = useState({});
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroJugadores, setFiltroJugadores] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { wsLPRef, wsUPRef } = useContext(WebSocketContext);

  const handlePasswordChange = (e, partidaId) => {
    setPasswordInputs({
      ...passwordInputs,
      [partidaId]: e.target.value,
    });
  };

  const handleJoinClick = (partida) => {
    if (partida.is_private && (!passwordInputs[partida.id] || passwordInputs[partida.id].trim() === "")) {
      setErrorMessage("Por favor ingrese una contraseña para unirse a una partida privada.");
      setShowErrorModal(true);
      return;
    }

    const password = partida.is_private ? passwordInputs[partida.id] : null;
    joinGame(partida, password);
  };

  const joinGame = async (partida, password) => {
    try {
      const player_id = parseInt(sessionStorage.getItem("player_id"), 10);
      wsUPRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/lobby/${partida.id}?player_id=${player_id}`);

      wsUPRef.current.onopen = () => {
        const startMessage = {
          user_identifier: sessionStorage.getItem('identifier'),
          password: password
        };
        wsUPRef.current.send(JSON.stringify(startMessage));
      };

      wsUPRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.error === 'Invalid password') {
          setErrorMessage("Contraseña incorrecta. Intente de nuevo.");
          setShowErrorModal(true);
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
        setErrorMessage("Se produjo un error al intentar unirse a la partida.");
        setShowErrorModal(true);
      };
    } catch (error) {
      setErrorMessage("Ocurrió un error inesperado al intentar unirse.");
      setShowErrorModal(true);
    }
  };

  const fetchPartidas = async () => {
    try {
      let params = {};
      if (filtroNombre) params.name = filtroNombre;
      if (filtroJugadores) params.max_players = parseInt(filtroJugadores);

      let query = new URLSearchParams(params).toString();
      const response = await fetch(`http://127.0.0.1:8000/api/lobby?${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('No se pudo obtener las partidas.');

      const data = await response.json();
      setPartidas(data);
    } catch (error) {
      console.error("No se pudo obtener las partidas.");
      setErrorMessage("Error al obtener partidas disponibles.");
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    fetchPartidas();
  }, [filtroNombre, filtroJugadores]);

  useEffect(() => {
    wsLPRef.current = new WebSocket("ws://127.0.0.1:8000/ws/api/lobby");

    wsLPRef.current.onopen = () => console.log("WebSocket de Listar Partida conectado");

    wsLPRef.current.onmessage = (event) => {
      const updatedMessage = JSON.parse(event.data);
      if (updatedMessage.message === "update") fetchPartidas();
    };

    wsLPRef.current.onerror = (error) => console.error("WebSocket Listar Partida error:", error);

    wsLPRef.current.onclose = () => console.log("WebSocket de Listar Partida cerrado");

    return () => {
      if (wsLPRef.current) wsLPRef.current.close();
    };
  }, []);

  const closeModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const partidasFiltradas = partidas.filter((partida) =>
    partida.name.toLowerCase().startsWith(filtroNombre.toLowerCase()) &&
    (filtroJugadores === "" || partida.current_players === parseInt(filtroJugadores)) &&
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

      {showErrorModal && (
        <div className="error-modal">
          <div className="modal-content">
            <p>{errorMessage}</p>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}

      {partidasFiltradas.length === 0 ? (
        <p className="texto-centrado">No se encontraron partidas, pruebe con otro nombre o número de jugadores.</p>
      ) : (
        <ul role="list" className="contenedor-lista">
          {partidasFiltradas.map((partida) => (
            <li key={partida.id} className="item-partida" role="listitem">
              <div className="list-item-izq">
                <p className="item-partida-nombre">{partida.name}</p>
                <p className="item-partida-jugadores"><b>Jugadores:</b> {partida.current_players}/{partida.max_players}</p>
                <p className="item-partida-tipo"><b>Tipo:</b> {partida.is_private ? 'Privada' : 'Pública'}</p>
              </div>
              <div className="item-partida-der">
                {partida.is_private && (
                  <input
                    type="password"
                    className="input-password"
                    placeholder="Contraseña"
                    autoComplete="new-password"
                    value={passwordInputs[partida.id] || ''}
                    onChange={(e) => handlePasswordChange(e, partida.id)}
                  />
                )}
                <button
                  className="item-partida-boton"
                  onClick={() => handleJoinClick(partida)}
                  disabled={partida.current_players >= partida.max_players}
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
