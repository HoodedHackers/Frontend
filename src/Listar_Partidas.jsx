import "./Style/Listar_Partidas.css";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ACCIONES = {
  ACTUALIZACION_EN_PARTIDAS: 'actualizacion_en_partidas',
  RESPUESTA_UNION: 'respuesta_union',
  AGREGAR_JUGADOR:'agregar_jugador'
};

function Listar_Partidas() {
  const [partidas, setPartidas] = useState([]);
  const [botonesDeshabilitados, setBotonesDeshabilitados] = useState({});
  const navigate = useNavigate();
  const wsRef = useRef(null);

  const manejarWs = (event) => {
    const data = JSON.parse(event.data);
    switch (data.action) {
      case ACCIONES.ACTUALIZACION_EN_PARTIDAS:
        fetchPartidas();
        break;
      case ACCIONES.RESPUESTA_UNION:
        const { partidaId, success } = data;
        if (success) {
          navigate('/Partida/' + partidaId);
        } 
        break;
      default:
        console.warn(`Acción desconocida: ${data.action}`);
    }
  };

  const Unirse = async (id) => {
    const message = JSON.stringify({ action: ACCIONES.AGREGAR_JUGADOR, partidaId: id });
    wsRef.current.send(message);
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

    // Configuración del WebSocket
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/lobby');
    wsRef.current = ws;

    // Manejador de mensajes del WebSocket
    ws.onmessage = manejarWs;

    // Cleanup: cerrar el WebSocket al desmontar el componente
    return () => {
      ws.close();
    };
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
