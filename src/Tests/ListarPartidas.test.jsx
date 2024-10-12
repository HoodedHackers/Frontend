import React from 'react';
import { describe, it, vi, afterEach, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from "react-router-dom";
import ListarPartidas from '../components/Opciones/ListarPartidas/ListarPartidas.jsx';

const navigateMock = vi.fn();

const mockWebSocket = {
  send: vi.fn(),
  close: vi.fn(),
  onopen: vi.fn(),
  onmessage: vi.fn(),
  onclose: vi.fn(),
  onerror: vi.fn(),
};

global.WebSocket = vi.fn(() => mockWebSocket);

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

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
    // Mock para simular el useState de Listar Partidas
    const useStateMock = vi.spyOn(React, 'useState');
    useStateMock.mockReturnValue([[], vi.fn()]); // Estado inicial vacío

    render(
      <ListarPartidas />
    );

    // Verificar que se muestra un mensaje indicando que no hay partidas
    const message = screen.getByText(/No hay partidas disponibles en este momento. Por favor, intente crear una partida./i);
    expect(message).toBeInTheDocument();
  });

  it('Se conecta al endpoint para obtener las partidas', async () => {

  });

  it('Muestra un error si el GET falla', async () => {

  });

  it('Renderiza una lista de partidas correctamente', async () => {

  });

  it('Se conecta con el WebSocket de Listar Partidas', () => {

  });

  it('Muestra un error si el WebSocket de Listar Partidas', () => {

  });

  it('Vuelve a renderizar si recibe partidas desde el WebSocket de Listar Partidas', () => {

  });

  it('Se conecta con el endpoint de Unirse a Partida', () => {

  });

  it('Muestra un error si el endpoint falla', () => {

  });

  it('Se conecta con el WebSocket de Unirse a Partida', () => {

  });

  it('Muestra un error si el WebSocket falla', () => {

  });

  it('Permite al usuario unirse a una partida', async () => {

  });

});