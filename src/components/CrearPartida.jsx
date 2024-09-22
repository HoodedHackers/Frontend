import React, { useState } from 'react';
import { Button } from '@mui/material';
import './CrearPartida.css'; 

export default function CrearPartida() {

    const [partidaDatos, setPartidaDatos] = useState({
        nombrePartida: '',
        minJugadores: '',
        maxJugadores: ''
    })

    const manejarPartidaDatos = (e) => {
        setPartidaDatos({
            ...partidaDatos,
            [e.target.name]: e.target.value
        })
    }

    const manejarBotonCrearPartida = async (e) => {
        e.preventDefault(); // Prevenir comportamiento por defecto del formulario

        const partidaJson = {  // Crear un objeto JSON con los datos de la partida
            nombrePartida: partidaDatos.nombrePartida,
            minJugadores: partidaDatos.minJugadores,
            maxJugadores: partidaDatos.maxJugadores
        }

        try {
            const response = await fetch('https://httpbin.org/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indicar que se envía JSON
                },
                body: JSON.stringify(partidaJson) // Convertir el objeto a un string JSON
            })
            const data = await response.json();
            console.log('Éxito:', data)
            // Agregar lógica para redirigir o mostrar mensaje de éxito al usuario
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <form onSubmit={manejarBotonCrearPartida} className="form-container">
            <div className="form-group">
                <div className="form-field">
                    <label htmlFor="nombrePartida">Nombre de Partida</label>
                    <input
                        id="nombrePartida"
                        name="nombrePartida"
                        type="text"
                        autoComplete="off"
                        required
                        value={partidaDatos.nombrePartida}
                        onChange={manejarPartidaDatos}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="minJugadores">Min Jugadores</label>
                    <input
                        id="minJugadores"
                        name="minJugadores"
                        type="text"
                        autoComplete="off"
                        inputMode="numeric" // Utilizar inputMode en lugar de type="number"
                        required
                        value={partidaDatos.minJugadores}
                        onChange={manejarPartidaDatos}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="maxJugadores">Max Jugadores</label>
                    <input
                        id="maxJugadores"
                        name="maxJugadores"
                        type="text"
                        autoComplete="off"
                        inputMode="numeric" // Utilizar inputMode en lugar de type="number"
                        required
                        value={partidaDatos.maxJugadores}
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


