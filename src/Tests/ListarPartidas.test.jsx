import React from 'react';
import { describe, it, vi, afterEach, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from "react-router-dom";
import ListarPartidas from '../components/Opciones/ListarPartidas/ListarPartidas.jsx';
import { WebSocketProvider } from '../components/WebSocketsProvider.jsx';

const mockFetch = (data, status = 200) => {
  return vi.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(data),
    })
  );
};

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.onopen = jest.fn();
    this.onmessage = jest.fn();
    this.onerror = jest.fn();
    this.onclose = jest.fn();
    this.sentMessages = [];
  }

  send(message) {
    this.sentMessages.push(message);
  }

  close() {
    this.onclose();
  }

  // Simula que el socket recibe un mensaje
  receiveMessage(data) {
    this.onmessage({ data: JSON.stringify(data) });
  }
}

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
      <WebSocketProvider>
        <ListarPartidas />
      </WebSocketProvider>
    );

    // Verificar que se muestra un mensaje indicando que no hay partidas
    const message = screen.getByText(/No hay partidas disponibles en este momento. Por favor, intente crear una partida./i);
    expect(message).toBeInTheDocument();
  });

  it('Muestra un error por consola si el GET falla', async () => {
    global.fetch = mockFetch(null, 404);

    // Mock de console.error
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <WebSocketProvider>
        <ListarPartidas />
      </WebSocketProvider>
    );

    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalled();
      const errorArg = consoleErrorMock.mock.calls[0][0]; // Primer argumento pasado a console.error
      expect(errorArg.message).toBe("No se pudo obtener las partidas.");
    });
  });

  it('Se concecta al endpoint de Listar Partidas para renderizar partidas', async () => {
    global.fetch = mockFetch(partidas);

    render(
      <WebSocketProvider>
        <ListarPartidas />
      </WebSocketProvider>
    );

    expect(await screen.findByText('Partida Milo')).toBeInTheDocument();
    expect(screen.getByText('Partida Ely')).toBeInTheDocument();
    expect(screen.getByText('Partida Ema')).toBeInTheDocument();
    expect(screen.getByText('Partida Andy')).toBeInTheDocument();
    expect(screen.getByText('Partida Lou')).toBeInTheDocument();
    expect(screen.getByText('Partida Lu')).toBeInTheDocument();
    expect(screen.getByText('Partida Mati')).toBeInTheDocument();
  });

  it('Se conecta con el WebSocket de Listar Partidas', async () => {
    //const socketMock = createWebSocketMock(); // Crear el mock del WebSocket
  //
    //// Mockear el constructor del WebSocket para que devuelva nuestro mock
    //global.WebSocket = vi.fn(() => socketMock);
//
    //const consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {})
  //
    //render(
    //  <WebSocketProvider>
    //    <ListarPartidas />
    //  </WebSocketProvider>
    //);
  //
    //// Simular que la conexión se abre
    //socketMock.triggerOpen();
  //
    //// Verificar que se registró la conexión en el log
    //await waitFor(() => {
    //  expect(consoleLogMock).toHaveBeenCalledWith("WebSocket de Listar Partida conectado");
    //});
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
