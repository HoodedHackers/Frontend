import "./Style/Listar_Partidas.css";
import { useState } from 'react';

function Listar_Partidas({ partidas }) {
  const [partidasState, setPartidas] = useState(partidas || []);

  const Unirse = (id) => {
    setPartidas((prevPartidas) =>
      prevPartidas.map((partida) =>
        partida.id === id && partida.jugadores < partida.max_jugadores ?
        { ...partida, jugadores: partida.jugadores + 1 } : partida
      )
    );
  };

  // Función para obtener partidas desde el endpoint
  // useEffect(() => {
  //   const fetchPartidas = async () => {
  //     try {
  //       const response = await fetch('http://127.0.0.1:8000/api/lobby');
  //       if (!response.ok) {
  //         throw new Error('Error en la respuesta del servidor');
  //       }
  //       const data = await response.json();
  //       setPartidas(data);
  //     } catch (error) {
  //       console.error("Error fetching partidas:", error);
  //     }
  //   };
  //   fetchPartidas();
  // }, []);  // Este array vacío asegura que solo se ejecute una vez  

  return (
    <div className="contenedor-partidas">
      {partidasState.length === 0 ? (
        <p className="texto-centrado">No hay partidas disponibles en este momento. Por favor, intente crear una partida.</p>
      ) : (
        <ul role="list" className="contenedor-lista">
          {partidasState.map((partida) => (
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
                  disabled={partida.jugadores >= partida.max_jugadores}
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
