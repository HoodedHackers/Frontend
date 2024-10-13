import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AbandonarPartida.css';

const AbandonarPartida = () => {
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false);  
    const [fadeOut, setFadeOut] = useState(false); // Estado para manejar el desvanecimiento
    const navigate = useNavigate(); 

    const ident = sessionStorage.getItem('identifier');
    const partidaId = sessionStorage.getItem('partida_id');

    const manejadorAbandonarPartida = async () => {
        setLoading(true);  
        setError(null);  
        setFadeOut(false);

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
                
                const Jugadores = JSON.parse(sessionStorage.getItem('players')) || [];
                const jugadoresActualizados = Jugadores.filter(j => j.identifier !== ident);

                sessionStorage.setItem('players', JSON.stringify(jugadoresActualizados));

                navigate('/Opciones'); 
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
            navigate('/Opciones'); // OBVIAMENTE HAY QUE CAMBIAR ESTO 
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
