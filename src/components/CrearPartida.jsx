import React, { useState } from 'react';
import { Button } from '@mui/material';
import './CrearPartida.css'; 

export default function CrearPartida() {

    const [partidaDatos, setPartidaDatos] = useState({
        nombre: '',
        min_jugadores: 0,
        max_jugadores: 0
    })

    const manejarPartidaDatos = (e) => {
        setPartidaDatos({
            ...partidaDatos,
            [e.target.name]: e.target.value
        })
    }

    const manejarBotonCrearPartida = async (e) => {
        e.preventDefault(); // Prevenir comportamiento por defecto del formulario

        const solicitudJson = {
            partida: {
                nombre: partidaDatos.nombre,
                min_jugadores: partidaDatos.min_jugadores,
                max_jugadores: partidaDatos.max_jugadores
            },
            jugador: {
                id_jugador: 1, // Puedes cambiar estos valores según tu lógica
                nombre: "Jugador 1",
                host: true,
                en_partida: true
            }
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indicar que se envía JSON
                },
                body: JSON.stringify(solicitudJson) // Convertir el objeto a un string JSON
            })
            if (response.ok) { // Comprobar si la respuesta es exitosa (status 200-299)
                const data = await response.json();
                console.log('Partida creada:', data);
                
                // Aquí podrías obtener el ID de la partida o cualquier dato necesario de 'data'
                // const partidaId = data.id; // Asumiendo que la respuesta incluye un 'partidaId'
                
                // Redirigir al usuario a la pantalla de espera, pasando el ID de la partida
                // navigate(`/partida/${partidaId}/espera`); // Cambia la ruta según tu configuración
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <form onSubmit={manejarBotonCrearPartida} className="form-container">
            <div className="form-group">
                <div className="form-field">
                    <label htmlFor="nombre">Nombre de Partida</label>
                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        autoComplete="off"
                        required
                        value={partidaDatos.nombre}
                        onChange={manejarPartidaDatos}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="min_jugadores">Min Jugadores</label>
                    <input
                        id="min_jugadores"
                        name="min_jugadores"
                        type="text"
                        autoComplete="off"
                        inputMode="numeric"
                        required
                        value={partidaDatos.min_jugadores}
                        onChange={manejarPartidaDatos}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="max_jugadores">Max Jugadores</label>
                    <input
                        id="max_jugadores"
                        name="max_jugadores"
                        type="text"
                        autoComplete="off"
                        inputMode="numeric"
                        required
                        value={partidaDatos.max_jugadores}
                        onChange={manejarPartidaDatos}
                    />
                </div>
            </div>
            <div className="button-container">
                <Button
                    variant="contained"
                    type="submit"
                    className="crear-partida-boton"
                >
                    CREAR PARTIDA
                </Button>
            </div>
        </form>
    )
}


