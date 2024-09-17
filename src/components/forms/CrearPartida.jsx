import React, { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Container,
} from "@mui/material";

export default function CrearPartida() {
  const [partidaDatos, setPartidaDatos] = useState({
    // Se crea un estado con los valores iniciales de los inputs.
    nombrePartida: "",
    minJugadores: 0,
    maxJugadores: 0,
  });

  const manejarPartidaDatos = (e) => {
    // Función que se ejecuta cada vez que se modifican(evento) los datos en los campos.
    setPartidaDatos({
      ...partidaDatos, // (...)Se mantiene el estado anterior, solo se actualiza el valor del input que se cambió.
      [e.target.name]: e.target.value, // Se actualiza el valor del input que se cambió.
    });
  };

  const manejarBotonCrearPartida = async (e) => {
    // Funcion que se ejecuta al hacer click(evento) en el boton de crear partida.

    e.preventDefault(); // Se previene el comportamiento por defecto del formulario.

    const formData = new FormData(); // Usamos FormData para enviar los datos como un formulario
    formData.append("nombrePartida", partidaDatos.nombrePartida);
    formData.append("minJugadores", partidaDatos.minJugadores);
    formData.append("maxJugadores", partidaDatos.maxJugadores);

    try {
      const response = await fetch("https://httpbin.org/post", {
        // Se hace una petición POST a la API con los datos de la partida.
        method: "POST",
        body: formData, // Usamos formData para enviar los datos como un formulario.
      });
      const data = await response.json();
      console.log("Éxito:", data);
      // Deberia de agregar logica para redirigir al usuario a la pagina de la partida creada.
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={manejarBotonCrearPartida}>
      <div className="space-y-4">
        <div className="col-span-full sm:col-span-3">
          <label
            htmlFor="nombrePartida"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Nombre de Partida
          </label>
          <div className="mt-2">
            <input
              id="nombrePartida"
              name="nombrePartida"
              type="text"
              autoComplete="off"
              value={partidaDatos.nombrePartida}
              onChange={manejarPartidaDatos}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"
            />
          </div>
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="minJugadores"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Min Jugadores
          </label>
          <div className="mt-2">
            <input
              id="minJugadores"
              name="minJugadores"
              type="number"
              autoComplete="off"
              value={partidaDatos.minJugadores}
              onChange={manejarPartidaDatos}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"
            />
          </div>
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="maxJugadores"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Max Jugadores
          </label>
          <div className="mt-2">
            <input
              id="maxJugadores"
              name="maxJugadores"
              type="number"
              autoComplete="off"
              value={partidaDatos.maxJugadores}
              onChange={manejarPartidaDatos}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-center"
            />
          </div>
        </div>
      </div>
      <div className="py-6 px-3">
        <button type="submit" variant="outlined" className="custom-button">
          CREAR PARTIDA
        </button>
      </div>
    </form>
  );
}
