import React, { useContext } from 'react';
import './CancelarMovimientos.css';
import { PartidaContext } from '../PartidaProvider.jsx';

const CancelarMovimientos = ({ jugadorActual }) => {
  const { partidaIniciada } = useContext(PartidaContext); // Accede a partidaIniciada
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
      }

      const data = await response.json();
      console.log('Movimientos cancelados:', data);

      // Deshabilitar cartaMovimiento después de cancelar el movimiento
      setCartaMovimiento(false);

    } catch (error) {
      console.error('Error al deshacer el movimiento:', error);
    }
  };

  if (!partidaIniciada) return null; // No mostrar el botón si la partida no ha comenzado

  return (
    <div className="cancelar-movimientos-btn">
      <button onClick={cancelarMovimientos}>
        Cancelar Movimientos
      </button>
    </div>
  );
};

export default CancelarMovimientos;
