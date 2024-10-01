import React, { useEffect } from 'react';
import CartaFigura from './carta_figura'; 
import './mazo_carta_figura.css'; 

function Mazo_Carta_Figura ({ubicacion, onMouseEnter, onMouseLeave}) {
  const [mazo, setMazo] = React.useState([
    { player: 1, cards_out: [{ card_id: 30, card_name: "Soy Figura" },
      { card_id: 21, card_name: "Soy Figura" },
      { card_id: 42, card_name: "Soy Figura" }] 
    },
    { player: 2, cards_out: [{ card_id: 31, card_name: "Soy Figura" },
      { card_id: 22, card_name: "Soy Figura" },
      { card_id: 43, card_name: "Soy Figura" }] 
    },
    { player: 3, cards_out: [{ card_id: 32, card_name: "Soy Figura" }, 
      { card_id: 23, card_name: "Soy Figura" }, 
      { card_id: 44, card_name: "Soy Figura" }] 
    },
    { player: 4, cards_out: [{ card_id: 33, card_name: "Soy Figura" }, 
      { card_id: 24, card_name: "Soy Figura" },
      { card_id: 45, card_name: "Soy Figura" }] 
    },
  ]); 
    
  const [partidaId, setPartidaId] = React.useState(null);
  const [jugadores, setJugadores] = React.useState([]);

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

  // Verifica si cartaMovimientos tiene el jugador en la ubicación y si tiene cartas
  const cartasDelJugador = mazo[ubicacion]?.cards_out || [];

  return (
    <div className={`container-cartas-figura grupo-${ubicacion + 1}`}>
      {cartasDelJugador.length > 0 ? (
        cartasDelJugador.map((carta) => (
          <div key={carta.card_id} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <CartaFigura tipo={(carta.card_id % 25) + 1} />
          </div>
        ))
      ) : (
        null
      )}
    </div>
  );
};

export default Mazo_Carta_Figura;