import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MazoCartaFigura from '../components/Partida/CartaFigura/MazoCartaFigura.jsx';
import { PartidaContext } from '../components/Partida/PartidaProvider.jsx';
import { WebSocketContext } from '../components/WebSocketsProvider.jsx';

describe('MazoCartaFigura', () => {
  const mockHandleMouseEnter = vi.fn();
  const mockHandleMouseLeave = vi.fn();

  const partidaContextValue = {
    handleMouseEnter: mockHandleMouseEnter,
    handleMouseLeave: mockHandleMouseLeave,
    partidaIniciada: true,
  };

  const webSocketContextValue = {
    wsCFRef: { current: { send: vi.fn(), close: vi.fn() } },
  };

  const mazo = [
    { player_id: 1, cards: [1, 2, 3] },
    { player_id: 2, cards: [4, 5, 6] }
  ];

  it('debería renderizar las cartas correctamente para un jugador con cartas', () => {
    // Renderizar el componente con el contexto simulado
    render(
      <PartidaContext.Provider value={partidaContextValue}>
        <WebSocketContext.Provider value={webSocketContextValue}>
          <MazoCartaFigura ubicacion={0} mazo={mazo} />
        </WebSocketContext.Provider>
      </PartidaContext.Provider>
    );

    // Verificar que las cartas se hayan renderizado (suponiendo que CartaFigura tiene role="img")
    const cartaFiguraElements = screen.getAllByRole('img'); // Verifica que CartaFigura use role="img"
    expect(cartaFiguraElements.length).toBe(3);
  });

  it('debería mostrar un mensaje cuando no hay cartas disponibles', () => {
    // Renderizar el componente con un jugador sin cartas
    render(
      <PartidaContext.Provider value={partidaContextValue}>
        <WebSocketContext.Provider value={webSocketContextValue}>
          <MazoCartaFigura ubicacion={0} mazo={[]} />
        </WebSocketContext.Provider>
      </PartidaContext.Provider>
    );

    // No debería haber cartas renderizadas
    expect(screen.queryByRole('img')).toBeNull(); // No se deben renderizar cartas
  });

  it('debería llamar a handleMouseEnter y handleMouseLeave cuando el mouse entra y sale de una carta', () => {
    // Renderizar el componente con el contexto simulado
    render(
      <PartidaContext.Provider value={partidaContextValue}>
        <WebSocketContext.Provider value={webSocketContextValue}>
          <MazoCartaFigura ubicacion={0} mazo={mazo} />
        </WebSocketContext.Provider>
      </PartidaContext.Provider>
    );

    // Obtener la primera carta
    const primeraCarta = screen.getAllByRole('img')[0];

    // Simular el evento mouseEnter
    fireEvent.mouseEnter(primeraCarta);
    expect(mockHandleMouseEnter).toHaveBeenCalledTimes(1);

    // Simular el evento mouseLeave
    fireEvent.mouseLeave(primeraCarta);
    expect(mockHandleMouseLeave).toHaveBeenCalledTimes(1);
  });
});
