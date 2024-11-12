import { describe, it, vi, beforeEach, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from '../components/Partida/Chat/Chat.jsx';
import { WebSocketContext } from '../components/WebSocketsProvider.jsx';
import { MockWebSocket } from './mock-sockets.jsx';
import { type } from '@testing-library/user-event/dist/cjs/utility/type.js';

const mockGameId = '123';
const mockPlayerId = '456';

describe('Chat Component', () => {
  let socketMock;

  beforeEach(() => {
    // Configurar el mock de WebSocket y el contexto
    socketMock = new MockWebSocket();
    global.WebSocket = vi.fn(() => socketMock);

    // Guardar game_id y player_id en sessionStorage
    sessionStorage.setItem('partida_id', mockGameId);
    sessionStorage.setItem('player_id', mockPlayerId);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it('Se conecta al WebSocket al montar', async () => {
    const wsCRef = { current: null };
    const consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <WebSocketContext.Provider value={{ wsCRef }}>
        <Chat />
      </WebSocketContext.Provider>
    );

    // Simular apertura de la conexión WebSocket
    socketMock.triggerOpen();

    await waitFor(() => {
      expect(consoleLogMock).toHaveBeenCalledWith("Conexión con el WebSocket del Chat abierta");
    });
  });

  it('Envía un mensaje correctamente', async () => {
    const wsCRef = { current: socketMock };

    render(
      <WebSocketContext.Provider value={{ wsCRef }}>
        <Chat />
      </WebSocketContext.Provider>
    );

    // Buscar el input y el botón de enviar
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /enviar/i });

    // Escribir y enviar mensaje
    fireEvent.change(input, { target: { value: 'Mensaje de prueba' } });
    fireEvent.click(sendButton);

    // Comprobar que el mensaje se haya enviado
    expect(socketMock.sentMessages).toContainEqual(JSON.stringify({ message: 'Mensaje de prueba' }));
  });

  it('Renderiza un mensaje recibido correctamente', async () => {
    const wsCRef = { current: socketMock };

    render(
      <WebSocketContext.Provider value={{ wsCRef }}>
        <Chat />
      </WebSocketContext.Provider>
    );

    // Simular recepción de mensaje
    socketMock.triggerOpen();
    socketMock.receiveMessage({ name: 'UsuarioTest', message: 'Hola desde WebSocket' });

    // Esperar que el mensaje aparezca en el DOM
    await waitFor(() => {
      expect(screen.getByText('Hola desde WebSocket')).toBeInTheDocument();
      expect(screen.getByText('UsuarioTest')).toBeInTheDocument();
    });
  });

  it('Renderiza múltiples mensajes correctamente', async () => {
    const wsCRef = { current: socketMock };

    render(
      <WebSocketContext.Provider value={{ wsCRef }}>
        <Chat />
      </WebSocketContext.Provider>
    );

    // Simular recepción de varios mensajes
    socketMock.triggerOpen();
    const mensajes = [
      { name: 'Jugador 1', message: 'Mensaje 1' },
      { name: 'Jugador 2', message: 'Mensaje 2' },
      { name: 'Jugador 3', message: 'Mensaje 3' }
    ];

    mensajes.forEach(mensaje => socketMock.receiveMessage(mensaje));

    // Verificar que cada mensaje aparezca en el DOM
    await waitFor(() => {
      mensajes.forEach(({ name, message }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });
  });

  it('Renderiza mensaje de descarte', async () => {
    const wsCRef = { current: socketMock };

    render(
      <WebSocketContext.Provider value={{ wsCRef }}>
        <Chat />
      </WebSocketContext.Provider>
    );

    socketMock.triggerOpen();
    const mensajes = [
      { name: 'Jugador 1', message: 'Jugador 1 ha descartado una carta de figura.' },
    ];

    mensajes.forEach(mensaje => socketMock.receiveMessage(mensaje));

    // Verificar que cada mensaje aparezca en el DOM
    await waitFor(() => {
      expect(screen.getByText('Sistema')).toBeInTheDocument();
      expect(screen.getByText('Jugador 1 ha descartado una carta de figura.')).toBeInTheDocument();
    });
  });

  it('Renderiza mensaje de bloqueo', async () => {
    const wsCRef = { current: socketMock };

    render(
      <WebSocketContext.Provider value={{ wsCRef }}>
        <Chat />
      </WebSocketContext.Provider>
    );

    socketMock.triggerOpen();
    const mensajes = [
      { name: 'Jugador 1', message: 'Jugador 1 ha bloqueado una carta de figura.' },
    ];

    mensajes.forEach(mensaje => socketMock.receiveMessage(mensaje));

    // Verificar que cada mensaje aparezca en el DOM
    await waitFor(() => {
      expect(screen.getByText('Sistema')).toBeInTheDocument();
      expect(screen.getByText('Jugador 1 ha bloqueado una carta de figura.')).toBeInTheDocument();
    });
  });

  it('Renderiza mensaje de turno', async () => {
    const wsCRef = { current: socketMock };

    render(
      <WebSocketContext.Provider value={{ wsCRef }}>
        <Chat />
      </WebSocketContext.Provider>
    );

    socketMock.triggerOpen();
    const mensajes = [
      { name: 'Jugador 1', message: 'Turno de Jugador 1' },
    ];

    mensajes.forEach(mensaje => socketMock.receiveMessage(mensaje));

    // Verificar que cada mensaje aparezca en el DOM
    await waitFor(() => {
      expect(screen.getByText('Sistema')).toBeInTheDocument();
      expect(screen.getByText('Turno de Jugador 1')).toBeInTheDocument();
    });
  });

  it('Renderiza mensaje de abandono', async () => {
    const wsCRef = { current: socketMock };

    render(
      <WebSocketContext.Provider value={{ wsCRef }}>
        <Chat />
      </WebSocketContext.Provider>
    );

    socketMock.triggerOpen();
    const mensajes = [
      { name: 'Jugador 1', message: 'Jugador 1 ha abandonado la partida.' },
    ];

    mensajes.forEach(mensaje => socketMock.receiveMessage(mensaje));

    // Verificar que cada mensaje aparezca en el DOM
    await waitFor(() => {
      expect(screen.getByText('Sistema')).toBeInTheDocument();
      expect(screen.getByText('Jugador 1 ha abandonado la partida.')).toBeInTheDocument();
    });
  });

});
