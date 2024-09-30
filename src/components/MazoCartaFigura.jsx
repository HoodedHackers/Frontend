import React, { useState, useEffect } from 'react';
import CartaFigura from './CartaFigura'; // Importamos el componente CartaFigura
import './MazoCartaFigura.css'; // Estilos para el contenedor de MazoCartaFigura

const MazoCartaFigura = () => {
  const [mazo, setMazo] = useState([]); // Estado para almacenar el array de cartas del mazo

  // Función para simular la respuesta del backend
  const obtenerMazo = async () => {
    
    const simulatedResponse = {
      all_cards: [
        {
          player: '0123456789abcdef',
          cards_out: [
            { card_id: 1, card_name: 'Carta A' },
            { card_id: 2, card_name: 'Carta B' },
            { card_id: 3, card_name: 'Carta C' }
          ]
        },
        {
          player: 'abcdef0123456789',
          cards_out: [
            { card_id: 4, card_name: 'Carta D' },
            { card_id: 5, card_name: 'Carta E' },
            { card_id: 6, card_name: 'Carta F' }
          ]
        },
        {
          player: '0123456789abcdeh',
          cards_out: [
            { card_id: 7, card_name: 'Carta A' },
            { card_id: 8, card_name: 'Carta B' },
            { card_id: 9, card_name: 'Carta C' }
          ]
        },
        {
          player: '0123456789abcded',
          cards_out: [
            { card_id: 10, card_name: 'Carta A' },
            { card_id: 11, card_name: 'Carta B' },
            { card_id: 12, card_name: 'Carta C' }
          ]
        },
      ]
    };

    setMazo(simulatedResponse.all_cards); // Actualiza el estado con las cartas simuladas
  };
  /*const [partidaId, setPartidaId] = useState(null);
  const [jugadores, setJugadores] = useState([]);

  // Efecto para obtener partidaId y jugadores desde localStorage solo cuando el componente se monta
  useEffect(() => {
    const PartidaId = localStorage.getItem('partidaId');
    const Jugadores = JSON.parse(localStorage.getItem('jugadores'));

    if (PartidaId && Jugadores) {
      setPartidaId(PartidaId);
      setJugadores(Jugadores);
    }
  }, []); // [] asegura que este efecto solo se ejecute una vez cuando el componente se monta
*/
/*
  // Función para obtener las cartas desde el backend
  const obtenerMazo = async () => {
    if (!partidaId || jugadores.length === 0) return; // No ejecutar si no hay partidaId o jugadores

    try {
      const solicitudJSON = {
        match_id: partidaId,      // ID de la partida
        players: jugadores.map(j => j.identifier) // Lista de jugadores
      };

      const response = await fetch('https://api.backend/mazo', { // Cambia la URL por la del backend real
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
*/
  // Efecto para obtener las cartas una vez que tengamos partidaId y jugadores
  useEffect(() => {
    //if (partidaId && jugadores.length > 0) {
      obtenerMazo(); 
    //}
  }, []);

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