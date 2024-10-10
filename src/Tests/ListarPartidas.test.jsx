import { describe, it, vi, afterEach, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from "react-router-dom";
import ListarPartidas from '../components/Opciones/ListarPartidas/ListarPartidas.jsx';

describe('ListarPartidas Component', () => {
  const partidas = [
      { id: 1, name: 'Partida Milo', current_players: 2, max_players: 4 },
      { id: 2, name: 'Partida Ely', current_players: 2, max_players: 4 },
      { id: 3, name: 'Partida Ema', current_players: 2, max_players: 4 },
      { id: 4, name: 'Partida Andy', current_players: 2, max_players: 4 },
      { id: 5, name: 'Partida Lou', current_players: 2, max_players: 4 },
      { id: 6, name: 'Partida Lu', current_players: 2, max_players: 4 },
      { id: 7, name: 'Partida Mati', current_players: 2, max_players: 4 }
    ];
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Renderiza un mensaje cuando no hay partidas', async () => {

    render(
      <MemoryRouter>
        <ListarPartidas />
      </MemoryRouter>
    );

    // Espera a que el mensaje sea renderizado
    const mensaje = await screen.findByText('No hay partidas disponibles en este momento. Por favor, intente crear una partida.');

    expect(mensaje).toBeInTheDocument();
  });

  it('Renderiza una lista de partidas correctamente', () => {
    // Usando solo useState
  });

  it('Realiza el fetch para obtener las partidas', async () => {

  });

  it('Muestra un error si el fetch para obtener las partidas falla', async () => {

  });

  it('Actualiza las partidas vía WebSocket', async () => {
    
  });

  it('Muestra un error si el Websocket de actualización de partidas falla', async () => {

  });

  it('Realiza el fetch para unirse a partida', async () => {

  });

  it('Muestra un error si el fetch para unirse a partida falla', async () => {

  });

  it('Envía mensaje al WebSocket de unirse a partida', () => {

  });

  it('Muestra un error si el WebSocket de unirse a partida falla', async () => {

  });

  it('Permite al usuario unirse a una partida', async () => {

  });

});