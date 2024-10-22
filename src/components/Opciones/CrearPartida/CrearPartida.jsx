import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebSocketContext } from '../../WebSocketsProvider.jsx';
import './CrearPartida.css'; 

export default function CrearPartida() {
    const { wsUPRef } = useContext(WebSocketContext); 
    const [partidaDatos, setPartidaDatos] = useState({
        nombre: '',
        min_jugadores: '',
        max_jugadores: ''
    })

    const navigate = useNavigate();
    const [error, setError] = useState('');

    const manejarPartidaDatos = (e) => {
        setPartidaDatos({
            ...partidaDatos,
            [e.target.name]: e.target.value
        })
    } 

    const manejarBotonCrearPartida = async (e) => {
        e.preventDefault(); 
        
        const id_jugador = sessionStorage.getItem('identifier');
    
        const solicitudJson = {
                name: partidaDatos.nombre,
                min_players: partidaDatos.min_jugadores,
                max_players: partidaDatos.max_jugadores,
                identifier: id_jugador 
        };
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/lobby', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(solicitudJson) 
            });
            if (response.ok) { 
                const data = await response.json();
                setError('');
                console.log('Partida creada:', data);
                
                const partidaId = data.id;
                sessionStorage.setItem('partida_id', partidaId);
   
                // Conectar al WebSocket de Unirse a Partida
                const player_id = parseInt(sessionStorage.getItem("player_id"), 10);
                wsUPRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/lobby/${partidaId}?player_id=${player_id}`);

                // Manejar la conexión abierta
                wsUPRef.current.onopen = () => {
                    console.log("Conexión WebSocket de Unirse a Partida abierta");
                    
                    const startMessage = {
                        user_identifier: id_jugador
                    };
                    wsUPRef.current.send(JSON.stringify(startMessage));
                    console.log("Mensaje unión a partida enviado.");
                };
            
                // Manejar el arreglo de jugadores actualizado recibido como respuesta
                wsUPRef.current.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    sessionStorage.setItem("players", JSON.stringify(data.players));
                };
    
                // Manejar errores
                wsUPRef.current.onerror = (error) => {
                    console.error("WebSocket error:", error);
                };

                sessionStorage.setItem('isOwner', true);

                setTimeout(() => {
                    navigate(`/Partida/${partidaId}`);
                }, 1000);
            } else {
                const errorData = await response.json();
                console.error('Error al crear la partida:', errorData.detail);
                setError(`Error al crear la partida: ${errorData.detail}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    return ( 
        <form>
            <h1 className="crear-partidas-titulo">Crear Partida</h1>
            <div className="form-group">
                <div className="form-field">
                    <label htmlFor="nombre">Nombre de Partida</label>
                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        autoComplete="off"
                        value={partidaDatos.nombre}
                        onChange={manejarPartidaDatos}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="min_jugadores">Min Jugadores</label>
                    <input
                        id="min_jugadores"
                        name="min_jugadores"
                        type="number"
                        min="2"
                        max="4"
                        autoComplete="off"
                        value={partidaDatos.min_jugadores}
                        onChange={manejarPartidaDatos}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="max_jugadores">Max Jugadores</label>
                    <input
                        id="max_jugadores"
                        name="max_jugadores"
                        type="number"
                        min="2"
                        max="4"
                        autoComplete="off"
                        value={partidaDatos.max_jugadores}
                        onChange={manejarPartidaDatos}
                    />
                </div>
            </div>
            <div className="button-container">
                <button
                variant="contained"
                className="crear-partida-boton"
                onClick={manejarBotonCrearPartida}
                >
                    Crear Partida
                </button>
            </div>
            {error && (
                <div className="notification">
                    <p>{error}</p>
                    <button
                        className="notification-close"
                        onClick={() => setError('')}
                    >
                    </button>
                </div>
            )}
        </form>   
    )
}
