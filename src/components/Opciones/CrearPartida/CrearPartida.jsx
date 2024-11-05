import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebSocketContext } from '../../WebSocketsProvider.jsx';
import './CrearPartida.css';

export default function CrearPartida() {
    const { wsUPRef } = useContext(WebSocketContext);
    const [partidaDatos, setPartidaDatos] = useState({
        nombre: '',
        min_jugadores: '2',
        max_jugadores: '4',
        tipo: 'publica',  // pública o privada
        contrasena: ''  // contraseña para partidas privadas
    });

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const manejarPartidaDatos = (e) => {
        setPartidaDatos({
            ...partidaDatos,
            [e.target.name]: e.target.value
        });
    };

    const manejarBotonCrearPartida = async (e) => {
        e.preventDefault();

        const id_jugador = sessionStorage.getItem('identifier');
        
        const solicitudJson = {
            name: partidaDatos.nombre,
            min_players: partidaDatos.min_jugadores, // Cambiado para coincidir
            max_players: partidaDatos.max_jugadores, // Cambiado para coincidir
            identifier: id_jugador,
            is_private: partidaDatos.tipo === 'privada',
            password: partidaDatos.tipo === 'privada' ? partidaDatos.contrasena : null  // solo enviar si es privada
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

                wsUPRef.current.onopen = () => {
                    const startMessage = { user_identifier: id_jugador };
                    wsUPRef.current.send(JSON.stringify(startMessage));
                };

                wsUPRef.current.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    sessionStorage.setItem("players", JSON.stringify(data.players));
                };

                wsUPRef.current.onerror = (error) => {
                    console.error("WebSocket error:", error);
                };

                sessionStorage.setItem('isOwner', true);

                setTimeout(() => {
                    navigate(`/Partida/${partidaId}`);
                }, 1000);
            } else {
                const errorData = await response.json();
                setError(`Error al crear la partida: ${errorData.detail}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error al crear la partida');
        }
    };

    const manejarCopiarContrasena = () => {
        navigator.clipboard.writeText(partidaDatos.contrasena);
        setModalVisible(true);
        setTimeout(() => {
            setModalVisible(false);
        }, 1000);
    };

    return (
        <form>
            <h1 className="crear-partidas-titulo">Crear Partida</h1>
            <div className="form-field">
                <label htmlFor="tipo">Tipo de Partida</label>
                <select
                    id="tipo"
                    name="tipo"
                    value={partidaDatos.tipo}
                    onChange={manejarPartidaDatos}
                >
                    <option value="publica">Pública</option>
                    <option value="privada">Privada</option>
                </select>
            </div>

            <div className="form-group" data-privada={partidaDatos.tipo === 'privada'}>
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

                {partidaDatos.tipo === 'privada' && (
                    <div className="form-field">
                        <label htmlFor="contrasena">Contraseña</label>
                        <input
                            id="contrasena"
                            name="contrasena"
                            type="password"
                            placeholder="Contraseña" 
                            autoComplete="off"
                            value={partidaDatos.contrasena}
                            onChange={manejarPartidaDatos}
                        />
                        <button
                            type="button"
                            onClick={manejarCopiarContrasena}
                            className="copiar-contrasena"
                        >
                            Copiar Contraseña
                        </button>
                    </div>
                )}
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
                <div className="notification error">
                    <p>{error}</p>
                    <button
                        className="notification-close"
                        onClick={() => setError('')}
                    >
                        Cerrar
                    </button>
                </div>
            )}

            {modalVisible && (
                <div className="modal-copiar">
                    <p>¡Contraseña copiada al portapapeles!</p>
                </div>
            )}
        </form>
    );
}
