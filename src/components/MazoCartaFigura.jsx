import React, { useState, useEffect } from 'react';
import CartaFigura from './CartaFigura'; 
import './MazoCartaFigura.css'; 

const MazoCartaFigura = () => {
  const [mazo, setMazo] = useState([]); 
    
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

  }, []); 

  // Función para obtener las cartas desde el backend
  const obtenerMazo = async () => {

    try {
      const solicitudJSON = {
        game_id: partidaId,      
        players: jugadores.map(j => j.identifier) 
      };

      const response = await fetch('http://127.0.0.1:8000/api/partida/en_curso', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solicitudJSON), 
      });

      if (response.ok) {
        const data = await response.json(); 
        console.log('Mazo de cartas:', data); 
        setMazo(data.all_cards); 
      }
      
    } catch (error) {
      console.error('Error al obtener el mazo de cartas:', error); 
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