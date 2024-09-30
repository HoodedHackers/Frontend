import React, { useState, useEffect } from 'react';
import CartaFigura from './CartaFigura'; // Importamos el componente CartaFigura
import './MazoCartaFigura.css'; // Estilos para el contenedor de MazoCartaFigura

const MazoCartaFigura = () => {
  const [mazo, setMazo] = useState([]); // Estado para almacenar el array de cartas del mazo
    
  const [partidaId, setPartidaId] = useState(null);
  const [jugadores, setJugadores] = useState([]);

  // Efecto para obtener partidaId y jugadores desde localStorage solo cuando el componente se monta
  useEffect(() => {
    const PartidaId = localStorage.getItem('partidaId');
    const Jugadores = JSON.parse(localStorage.getItem('jugadores'));

    if (PartidaId && Jugadores) {
      setPartidaId(PartidaId);
      setJugadores(Jugadores);
      console.log(localStorage.getItem('partidaId'));
      console.log(JSON.parse(localStorage.getItem('jugadores')));
    }

  }, []); // [] asegura que este efecto solo se ejecute una vez cuando el componente se monta

  // Función para obtener las cartas desde el backend
  const obtenerMazo = async () => {
    //if (!partidaId || jugadores.length === 0) return; // No ejecutar si no hay partidaId o jugadores

    try {
      const solicitudJSON = {
        game_id: partidaId,      // ID de la partida
        players: jugadores.map(j => j.identifier) // Lista de jugadores
      };

      const response = await fetch('http://127.0.0.1:8000/api/partida/en_curso', { // Cambia la URL por la del backend real
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solicitudJSON), // Enviar el JSON al backend
      });

      if (response.ok) {
        const data = await response.json(); // Convertir la respuesta a JSON
        console.log('Mazo de cartas:', data); // Muestra el mazo de cartas en la consola
        setMazo(data.all_cards); // Actualizar el estado con las cartas obtenidas
      }
      
    } catch (error) {
      console.error('Error al obtener el mazo de cartas:', error); // Muestra el error en la consola
    }
  };

  // Efecto para obtener las cartas una vez que tengamos partidaId y jugadores
  useEffect(() => {
    if (partidaId && jugadores.length > 0) {
      console.log('PartidaId actualizado:', partidaId);
      console.log('Jugadores actualizados:', jugadores);
      obtenerMazo(); 
    }
  }, [partidaId, jugadores]);

  return (
    <div>
      {mazo.map((jugador, index) => (
        <div key={index} className={`grupo-cartas-container grupo-${index}`}>
          {/* Mostrar solo las primeras 3 cartas del jugador */}
          {jugador.cards_out.slice(0, 3).map((carta) => (
            <CartaFigura key={carta.card_id} id={carta.card_id} name={carta.card_name} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MazoCartaFigura;