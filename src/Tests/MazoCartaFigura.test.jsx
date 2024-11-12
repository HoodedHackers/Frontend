import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MazoCartaFigura from '../components/Partida/CartaFigura/MazoCartaFigura.jsx';
import { PartidaContext } from '../components/Partida/PartidaProvider.jsx';
import { WebSocketProvider } from '../components/WebSocketsProvider.jsx';

describe('MazoCartaFigura', () => {
  const mockHandleMouseEnter = vi.fn();
  const mockHandleMouseLeave = vi.fn();

  const mockContext = {
    handleMouseEnter: mockHandleMouseEnter,
    handleMouseLeave: mockHandleMouseLeave,
    mazo: [
      { player_id: 1, cards: [1, 2, 3] },
      { player_id: 2, cards: [4, 5, 6] },
    ],
    jugadores: [
      { player_id: 1 },
      { player_id: 2 },
    ],
    activePlayer: { player_name: "PlayerTest", player_id: 1 }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('No renderiza nada si no hay cartas en la ubicación especificada', () => {
    render(
      <WebSocketProvider>
        <PartidaContext.Provider value={{ ...mockContext, mazo: [] }}>
          <MazoCartaFigura ubicacion={0} />
        </PartidaContext.Provider>
      </WebSocketProvider>
    );

    const cartas = screen.queryAllByRole('img');
    expect(cartas).toHaveLength(0);
  });
});
