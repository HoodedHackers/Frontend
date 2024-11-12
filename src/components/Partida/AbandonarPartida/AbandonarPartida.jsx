import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AbandonarPartida.css';
import { WebSocketContext } from '../../WebSocketsProvider';

const AbandonarPartida = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const { wsUPRef, wsCRef } = useContext(WebSocketContext);
    const navigate = useNavigate();

    const ident = sessionStorage.getItem('identifier');
    const partidaId = sessionStorage.getItem('partida_id');

    const manejadorAbandonarPartida = async () => {
        setLoading(true);
        setError(null);
        setFadeOut(false);

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/lobby/${partidaId}/exit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier: ident }),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.status === "success") {
                    sessionStorage.removeItem('figurasEnTablero');
                    sessionStorage.removeItem('players');
                    sessionStorage.removeItem('timeLeft');
                    sessionStorage.removeItem('partida_id');
                    sessionStorage.removeItem('isOwner');
                    sessionStorage.removeItem('partidaIniciada');
                    wsUPRef.current.close();
                    const player_name = sessionStorage.getItem("player_nickname");
                    wsCRef.current.send(JSON.stringify({message: `${player_name} ha abandonado la partida.`}));
                    navigate('/Opciones');

                } else if (response.status === 404) {
                    setError('Lobby no encontrado.');
                } else if (response.status === 412) {
                    setError('No puedes abandonar, el juego ya ha comenzado.');
                } else {
                    setError('Ocurrió un error inesperado.');
                }
            } else {
                setError('Ocurrió un error inesperado.');
            }
        } catch (error) {
            setError('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setFadeOut(true); // Activa el desvanecimiento
                setTimeout(() => {
                    setError(null); // Limpia el mensaje de error después del desvanecimiento
                }, 5000); // Tiempo de desvanecimiento
            }, 5000); // Tiempo que el mensaje es visible

            return () => clearTimeout(timer); // Limpiar Temporizador
        }
    }, [error]); // Ejecutar efecto cada vez que 'error' cambie

    return (
        <div className="abandonar-partida-container">
            {error && (
                <p className={`error-message ${fadeOut ? 'fade-out' : ''}`}>
                    {error}
                </p>
            )}

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
