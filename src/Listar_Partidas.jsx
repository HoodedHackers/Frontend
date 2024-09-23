import "./Style/Listar_Partidas.css";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Listar_Partidas() {
  const [partidas, setPartidas] = useState([]);
  const [botonesDeshabilitados, setBotonesDeshabilitados] = useState({});
  const navigate = useNavigate();

  const Unirse = async (id) => {
    navigate(`/partida/${id}`);
  };

  const fetchPartidas = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/lobby');
      if (!response.ok) {
        throw new Error('No se pudo obtener las partidas');
      }
      const data = await response.json();
      setPartidas(data);
      
      const nuevosBotones = {};
      data.forEach(partida => {
        nuevosBotones[partida.id] = partida.jugadores >= partida.max_jugadores;
      });
      setBotonesDeshabilitados(nuevosBotones);
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
                <p className="item-partida-nombre">{partida.nombre}</p>
                <p className="item-partida-jugadores">
                  <b>Jugadores:</b> {partida.jugadores}/{partida.max_jugadores}
                </p>
              </div>
              <div className="item-partida-der">
                <button
                  className="item-partida-boton"
                  onClick={() => Unirse(partida.id)}
                  disabled={botonesDeshabilitados[partida.id]}
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
