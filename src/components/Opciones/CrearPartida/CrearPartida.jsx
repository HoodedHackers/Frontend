import React, { useState } from 'react';
import './CrearPartida.css'; 
import { useNavigate } from 'react-router-dom';

export default function CrearPartida() {

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
            })
            if (response.ok) { 
                const data = await response.json();
                setError('');
                console.log('Partida creada:', data);
                
                const partidaId = data.id;
                localStorage.setItem('partidaId', partidaId);
                
                // Crear un arreglo que contenga solo a este jugador
                let jugadores = [id_jugador];

                // Guardar el arreglo en localStorage bajo la clave 'jugadores'
                localStorage.setItem('jugadores', JSON.stringify(jugadores));
                
                navigate(`/partida/${partidaId}`); 

            } else {
                const errorData = await response.json();
                console.error('Error al crear la partida:', errorData.detail);
                setError(`Error al crear la partida: ${errorData.detail}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

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
