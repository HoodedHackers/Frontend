import "./Listar_Partidas.css";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Listar_Partidas({jugador_id}) {
  const [partidas, setPartidas] = useState([]);
  const navigate = useNavigate();

  const Unirse = async (partida_id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/lobby/${partida_id}`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "id_game": partida_id,
          "identifier_player": jugador_id
        }),
      });
      if (!response.ok) {
        throw new Error('Fallo al unirse a la partida');
      }
      navigate(`/partida/${partida_id}`);
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

  return (
    <div className="contenedor-partidas">
      {partidas.length === 0 ? (
        <p className="texto-centrado">No hay partidas disponibles en este momento. Por favor, intente crear una partida.</p>
      ) : (
        <ul role="list" className="contenedor-lista">
          {partidas.map((partida) => (
            <li key={partida.id} className="item-partida" role="listitem">
              <div className="list-item-izq">
                <p className="item-partida-nombre">{partida.name}</p>
                <p className="item-partida-jugadores">
                  <b>Jugadores:</b> {partida.jugadores}/{partida.max_players}
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

export default Listar_Partidas;
