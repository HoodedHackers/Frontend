import React, { useContext, useEffect, useState } from 'react';
import './CancelarMovimientos.css';
import { PartidaContext } from '../PartidaProvider.jsx';

const CancelarMovimientos = ({ jugadorActual }) => {
  const { movimientosRealizados, turnoActual } = useContext(PartidaContext);
  const [cancelarHabilitado, setCancelarHabilitado] = useState(false);

  const identifier = sessionStorage.getItem("identifier");
  const gameId = sessionStorage.getItem("gameId");

  useEffect(() => {
    if (movimientosRealizados.length > 0 && turnoActual === jugadorActual) {
      setCancelarHabilitado(true);
    } else {
      setCancelarHabilitado(false);
    }
  }, [movimientosRealizados, turnoActual, jugadorActual]);

  const cancelarMovimientos = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/game/${gameId}/undo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier }),
      });

      if (!response.ok) {
        throw new Error('Error al cancelar los movimientos');
      }

      const data = await response.json();
      console.log('Movimientos cancelados:', data);
      // Aquí puedes actualizar el estado después de deshacer los movimientos
    } catch (error) {
      console.error('Error al deshacer el movimiento:', error);
    }
  };

  return (
    <div className="cancelar-movimientos-btn">
      <button disabled={!cancelarHabilitado} onClick={cancelarMovimientos}>
        Cancelar Movimientos
      </button>
    </div>
  );
};

export default CancelarMovimientos;
