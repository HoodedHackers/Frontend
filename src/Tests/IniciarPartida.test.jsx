import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IniciarPartida from '../components/Partida/IniciarPartida/IniciarPartida';
import { WebSocketContext } from '../components/WebSocketsProvider';
import { PartidaContext } from '../components/Partida/PartidaProvider';
import React from 'react';

// Mock global para fetch
global.fetch = vi.fn();

// Mock para sessionStorage y localStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
  },
});

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
  },
});

// Mock para el WebSocketContext
const mockWebSocketContext = {
  wsStartGameRef: { current: { send: vi.fn() } },
};

// Mock para el PartidaContext
const mockPartidaContext = {
  isOwner: true,
};

// Renderiza el componente con los contextos mockeados
const renderWithContexts = () => {
  return render(
    <WebSocketContext.Provider value={mockWebSocketContext}>
      <PartidaContext.Provider value={mockPartidaContext}>
        <IniciarPartida />
      </PartidaContext.Provider>
    </WebSocketContext.Provider>
  );
};

describe('IniciarPartida Component', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    vi.clearAllMocks();
    sessionStorage.getItem.mockImplementation((key) => {
      if (key === 'partida_id') return '123';
      if (key === 'identifier') return 'player1';
      return null;
    });
  });

  it('debería renderizar el botón para iniciar la partida cuando el usuario es el propietario', () => {
    renderWithContexts();

    const startButton = screen.getByRole('button', { name: /Iniciar Partida/i });
    expect(startButton).toBeInTheDocument();
  });

  it('debería mostrar el mensaje de espera cuando el usuario no es el propietario', () => {
    mockPartidaContext.isOwner = false; // Cambiar a no propietario

    renderWithContexts();

    const waitingMessage = screen.getByText(/Esperando a que el CREADOR inicie la partida/i);
    expect(waitingMessage).toBeInTheDocument();
  });

});