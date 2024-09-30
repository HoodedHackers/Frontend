import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AbandonarPartida.css';

const AbandonarPartida = () => {
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false);  
    const navigate = useNavigate(); 

    const ident = localStorage.getItem('identifier');
    const partidaId = localStorage.getItem('partidaId');

    const manejadorAbandonarPartida = async () => {
        setLoading(true);  
        setError(null);  

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/lobby/salir/${partidaId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier: ident }), 
            });

            if (response.ok) {
                const data = await response.json();
                if (data.players.length === 1) {
                    alert(`¡Felicidades ${data.players[0].name}, ganaste la partida!`); 
                }
                
                const Jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
                const jugadoresActualizados = Jugadores.filter(j => j.identifier !== ident);

                localStorage.setItem('jugadores', JSON.stringify(jugadoresActualizados));

                navigate('/opciones'); 
            } else if (response.status === 404) {
                setError('Lobby no encontrado.');  
            } else if (response.status === 412) {
                setError('No puedes abandonar, el juego ya ha comenzado.');  
            } else {
                setError('Ocurrió un error inesperado.');  
            }
        } catch (error) {
            setError('Error de conexión con el servidor.');  
        } finally {
            setLoading(false);  
        }
    };
  
    return (
        <div className="abandonar-partida-container">
            {error && <p className="error-message">{error}</p>}
            
            <button 
                variant='contained'
                className='abandonar-partida-boton'
                onClick={manejadorAbandonarPartida}
                disabled={loading} 
            >
                {loading ? 'Saliendo...' : 'Abandonar Partida'}
            </button>
        </div>
    );
};

export default AbandonarPartida;