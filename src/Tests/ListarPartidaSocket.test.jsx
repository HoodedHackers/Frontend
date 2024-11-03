
import React from 'react';
import { describe, it, vi, afterEach, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ListarPartidas from '../components/Opciones/ListarPartidas/ListarPartidas.jsx';
import { WebSocketContext } from '../components/WebSocketsProvider.jsx';
import { MockWebSocket} from './mock-sockets.jsx';
import { MemoryRouter } from 'react-router-dom';


    const partidas = [
        { id: 1, name: 'Partida Milo', current_players: 2, max_players: 4 },
        { id: 2, name: 'Partida Ely', current_players: 2, max_players: 4 },
        { id: 3, name: 'Partida Ema', current_players: 2, max_players: 4 },
        { id: 4, name: 'Partida Andy', current_players: 2, max_players: 4 },
        { id: 5, name: 'Partida Lou', current_players: 2, max_players: 4 },
        { id: 6, name: 'Partida Lu', current_players: 2, max_players: 4 },
        { id: 7, name: 'Partida Mati', current_players: 2, max_players: 4 }
      ];

describe('ListarPartidas Component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Se conecta con el WebSocket de Listar Partidas', async () => {
    const socketMock = new MockWebSocket(); // Instancia del mock de WebSocket
    const wsLPRef = { current: {} }; // Simular la referencia del WebSocket
    const wsUPRef = { current: {} };

    // Mockear el constructor del WebSocket para que devuelva nuestro mock
    global.WebSocket = vi.fn(() => socketMock);

    const consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {});
    
      render(
        <MemoryRouter>
          <WebSocketContext.Provider value={{ wsLPRef, wsUPRef }}>
            <ListarPartidas />
          </WebSocketContext.Provider>
        </MemoryRouter>
      );

    // Simular que la conexión se abre
    socketMock.triggerOpen();

    // Verificar que se registró la conexión en el log
    await waitFor(() => {
      expect(consoleLogMock).toHaveBeenCalledWith("WebSocket de Listar Partida conectado");
    });
  });

});
