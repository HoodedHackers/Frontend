import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MazoCartaFigura from '../components/Partida/CartaFigura/MazoCartaFigura.jsx';
import { PartidaContext } from '../components/Partida/PartidaProvider.jsx';

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
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Debe llamar a handleMouseEnter y handleMouseLeave al pasar el mouse sobre las cartas', () => {
    render(
      <PartidaContext.Provider value={mockContext}>
        <MazoCartaFigura ubicacion={0} />
      </PartidaContext.Provider>
    );

    const cartas = screen.getAllByRole('img');

    // Simular el evento onMouseEnter
    fireEvent.mouseEnter(cartas[0]);
    expect(mockHandleMouseEnter).toHaveBeenCalled();

    // Simular el evento onMouseLeave
    fireEvent.mouseLeave(cartas[0]);
    expect(mockHandleMouseLeave).toHaveBeenCalled();
  });

  it('No renderiza nada si no hay cartas en la ubicación especificada', () => {
    render(
      <PartidaContext.Provider value={{ ...mockContext, mazo: [] }}>
        <MazoCartaFigura ubicacion={0} />
      </PartidaContext.Provider>
    );

    const cartas = screen.queryAllByRole('img');
    expect(cartas).toHaveLength(0);
  });

  it('Renderiza exactamente 3 cartas en el mazo', () => {
    render(
      <PartidaContext.Provider value={mockContext}>
        <MazoCartaFigura ubicacion={0} />
      </PartidaContext.Provider>
    );

    const cartas = screen.getAllByRole('img');
    expect(cartas.length).toBe(3); // Confirmación explícita de 3 cartas
  });
});
