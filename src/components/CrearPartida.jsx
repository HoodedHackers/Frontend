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
        e.preventDefault(); // Prevenir comportamiento por defecto del formulario

        const solicitudJson = {
                name: partidaDatos.nombre,
                min_players: partidaDatos.min_jugadores,
                max_players: partidaDatos.max_jugadores
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/lobby', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indicar que se envía JSON
                },
                body: JSON.stringify(solicitudJson) // Convertir el objeto a un string JSON
            })
            if (response.ok) { // Comprobar si la respuesta es exitosa (status 200-299)
                const data = await response.json();
                setError('');
                console.log('Partida creada:', data);
                
                // Aquí podrías obtener el ID de la partida o cualquier dato necesario de 'data'
                const partidaId = data.id; // Asumiendo que la respuesta incluye un 'partidaId'
                
                // Redirigir al usuario a la pantalla de espera, pasando el ID de la partida
                navigate(`/partida/${partidaId}`); // Cambia la ruta según tu configuración

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
        <form className="form-container">
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
                    type="submit"
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


