
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import IniciarPartida from '../components/Partida/IniciarPartida/IniciarPartida';
import { WebSocketContext } from '../components/WebSocketsProvider';
import { PartidaContext } from '../components/Partida/PartidaProvider';
import React from 'react';

// Crea un contexto mock para el WebSocket
const mockWebSocketContext = {
  wsStartGameRef: { current: { send: vi.fn() } },
};

// Crea un contexto mock para la Partida
const mockPartidaContext = {
  isOwner: true,
};

// Función de renderizado que envuelve el componente en los contextos
const renderWithContexts = () => {
  return render(
    <WebSocketContext.Provider value={mockWebSocketContext}>
      <PartidaContext.Provider value={mockPartidaContext}>
        <IniciarPartida />
      </PartidaContext.Provider>
    </WebSocketContext.Provider>
  );
};

describe('IniciarPartida', () => {
  it('renderiza el botón para iniciar la partida cuando es el propietario', () => {
    renderWithContexts();

    const button = screen.getByRole('button', { name: /Iniciar Partida/i });
    expect(button).toBeInTheDocument();
  });

  it('muestra el mensaje de espera cuando no es el propietario', () => {
    // Cambia isOwner a false
    mockPartidaContext.isOwner = false;

    renderWithContexts();

    const message = screen.getByText(/Esperando a que el CREADOR inicie la partida/i);
    expect(message).toBeInTheDocument();
  });

});
