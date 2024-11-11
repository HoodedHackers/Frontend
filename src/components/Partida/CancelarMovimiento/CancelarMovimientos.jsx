import React, { useContext } from 'react';
import './CancelarMovimientos.css';
import { PartidaContext } from '../PartidaProvider.jsx';

const CancelarMovimientos = ({ disabled }) => {
  const { partidaIniciada, setCancelarHabilitado, setCartasDelJugador } = useContext(PartidaContext);
  const ident = sessionStorage.getItem("identifier");
  const gameId = sessionStorage.getItem("partida_id");

  const cancelarMovimientos = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/game/${gameId}/undo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: ident }),
      });

      if (!response.ok) {
        throw new Error('Error al cancelar los movimientos');
      } else {
        const data = await response.json();
        console.log('Movimientos cancelados:', data);
        setCancelarHabilitado(false);
        sessionStorage.setItem("cartas_mov", JSON.stringify(data.card_mov));
        setCartasDelJugador(data.card_mov);
      }
    } catch (error) {
      console.error('Error al deshacer el movimiento:', error);
    }
  };

  if (!partidaIniciada) return null; // No mostrar el botón si la partida no ha comenzado

  return (
    <button
      onClick={cancelarMovimientos}
      disabled={disabled}
      className={`cancelar-movimientos-btn ${(disabled) ? "botonDeshabilitado" : ""}`}
    >
      Cancelar Movimientos
    </button>
  );
};

export default CancelarMovimientos;
