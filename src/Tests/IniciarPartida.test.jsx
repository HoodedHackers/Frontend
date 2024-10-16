// /tests/IniciarPartida.test.jsx
// /tests/IniciarPartida.test.jsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import IniciarPartida from '../components/Partida/IniciarPartida/IniciarPartida';
import { WebSocketContext } from '../components/WebSocketsProvider';
import { PartidaContext } from '../components/Partida/PartidaProvider';
import React from 'react';

// Mock de WebSocket para simular las conexiones y mensajes
class WebSocketMock {
  constructor(url) {
    this.url = url;
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.readyState = WebSocketMock.CONNECTING;
  }

  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  send(data) {
    if (this.onmessage) {
      this.onmessage({ data });
    }
  }

  close() {
    if (this.onclose) {
      this.onclose();
    }
  }

  open() {
    if (this.onopen) {
      this.onopen();
    }
    this.readyState = WebSocketMock.OPEN;
  }
}

describe('IniciarPartida Component', () => {
  let wsMock;
  let wsStartGameRef;

  beforeEach(() => {
    // Inicializar WebSocket mockeado
    wsMock = new WebSocketMock('ws://127.0.0.1:8000/ws/lobby/123/status?player_id=1');
    wsStartGameRef = { current: wsMock };

    // Mockear sessionStorage
    vi.spyOn(window.sessionStorage, 'getItem').mockImplementation((key) => {
      switch (key) {
        case 'partida_id':
          return '123';
        case 'identifier':
          return 'player1';
        case 'player_id':
          return '1';
        default:
          return null;
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
/*
  test('debe conectar al WebSocket y mostrar "Iniciar Partida" cuando es el creador', async () => {
    const mockStartGame = vi.fn();
  
    render(
      <WebSocketContext.Provider value={{ wsStartGameRef }}>
        <PartidaContext.Provider value={{ isOwner: true }}>
          <IniciarPartida empezarPartida={mockStartGame} />
        </PartidaContext.Provider>
      </WebSocketContext.Provider>
    );
  
    // Simular la apertura del WebSocket
    act(() => {
      wsMock.open();
    });
  
    const button = screen.getByText('Iniciar Partida');
    expect(button).toBeInTheDocument();
  
    // Simular el clic en el botón de iniciar partida
    fireEvent.click(button);
  
    // Esperar a que el WebSocket maneje el mensaje
    await act(async () => {
        wsMock.send(JSON.stringify({ status: 'started' }));
        await new Promise(resolve => setTimeout(resolve, 100)); // Esperar un poco
    });
  
    // Ahora verificar que la función `empezarPartida` fue llamada
    expect(mockStartGame).toHaveBeenCalledTimes(1);
  
    // Verifica que el texto indica que la partida ha comenzado
    expect(screen.getByText('La partida ha comenzado. ¡Prepárate para jugar!')).toBeInTheDocument();
});*/

  test('debe mostrar "Esperando a que el CREADOR inicie la partida" si no es el creador', () => {
    render(
      <WebSocketContext.Provider value={{ wsStartGameRef }}>
        <PartidaContext.Provider value={{ isOwner: false }}>
          <IniciarPartida empezarPartida={vi.fn()} />
        </PartidaContext.Provider>
      </WebSocketContext.Provider>
    );

    expect(screen.getByText('Esperando a que el CREADOR inicie la partida...')).toBeInTheDocument();
  });

  test('debe manejar errores al iniciar la partida', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: 'Error al iniciar la partida' }),
      })
    );

    render(
      <WebSocketContext.Provider value={{ wsStartGameRef }}>
        <PartidaContext.Provider value={{ isOwner: true }}>
          <IniciarPartida empezarPartida={vi.fn()} />
        </PartidaContext.Provider>
      </WebSocketContext.Provider>
    );

    const button = screen.getByText('Iniciar Partida');
    fireEvent.click(button);

    expect(button).toBeDisabled();

    await screen.findByText('Error al iniciar la partida');
    expect(screen.getByText('Error al iniciar la partida')).toBeInTheDocument();
  });
});

