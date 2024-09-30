// src/Tests/Tablero.test.jsx
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import Tablero from '../components/Tablero/Tablero';

describe('Componente Tablero', () => {
  let mockWebSocket;

  beforeEach(() => {
    mockWebSocket = {
      send: vi.fn(),
      onopen: null,
      onmessage: null,
      onerror: null,
      close: vi.fn(),
    };

    global.WebSocket = vi.fn(() => mockWebSocket);

    render(<Tablero jugadores={['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4']} />);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('se renderiza sin fallos', () => {
    expect(screen.getByText('Jugador 1')).toBeInTheDocument();
  });

});
