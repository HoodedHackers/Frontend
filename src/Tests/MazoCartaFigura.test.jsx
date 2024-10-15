import { render, screen, waitFor, act } from '@testing-library/react';
import MazoCartaFigura from '../components/Partida/CartaFigura/MazoCartaFigura.jsx';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { PartidaContext } from '../components/Partida/PartidaProvider.jsx'; // Asegúrate de tener esto exportado

describe('MazoCartaFigura', () => {
  // Mocks para las funciones del contexto
  const handleMouseEnter = vi.fn();
  const handleMouseLeave = vi.fn();

  beforeEach(() => {
    // Simular valores de sessionStorage antes de cada prueba
    const mockPartidaId = '12345';
    const mockJugadores = [
      { identifier: '1', name: 'Jugador 1' },
      { identifier: '2', name: 'Jugador 2' }
    ];
    sessionStorage.setItem('partida_id', mockPartidaId);
    sessionStorage.setItem('players', JSON.stringify(mockJugadores));

    // Mockear la respuesta del backend (fetch)
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            all_cards: [
              {
                player: 'Jugador1',
                cards_out: [
                  { card_id: 1, card_name: 'Carta 1' },
                  { card_id: 2, card_name: 'Carta 2' },
                  { card_id: 3, card_name: 'Carta 3' },
                ],
              },
              {
                player: 'Jugador2',
                cards_out: [
                  { card_id: 4, card_name: 'Carta 4' },
                  { card_id: 5, card_name: 'Carta 5' },
                  { card_id: 6, card_name: 'Carta 6' },
                ],
              },
            ],
          }),
      })
    );
  });

  afterEach(() => {
    vi.clearAllMocks(); // Limpiar mocks después de cada prueba
    sessionStorage.clear(); // Limpiar sessionStorage
  });

  it('Renderiza correctamente sin cartas iniciales', async () => {
    await act(async () => {
      render(
        <PartidaContext.Provider value={{ handleMouseEnter, handleMouseLeave }}>
          <MazoCartaFigura ubicacion={0} />
        </PartidaContext.Provider>
      );
    });

    const container = screen.queryByText(/No hay cartas disponibles/i); // Ajusta según tu diseño de componente
    expect(container).not.toBeInTheDocument(); // Verificamos si no hay cartas cuando se carga por primera vez
  });

  it('Hace una llamada fetch y actualiza el mazo de cartas', async () => {
    await act(async () => {
      render(
        <PartidaContext.Provider value={{ handleMouseEnter, handleMouseLeave }}>
          <MazoCartaFigura ubicacion={0} />
        </PartidaContext.Provider>
      );
    });

    // Esperar a que el mazo de cartas se actualice
    await waitFor(() => {
      expect(screen.getByAltText('Carta de Figura 1')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de Figura 2')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de Figura 3')).toBeInTheDocument();
    });

    // Asegurarse de que el fetch fue llamado
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('Renderiza las cartas de los jugadores correctamente', async () => {
    await act(async () => {
      render(
        <PartidaContext.Provider value={{ handleMouseEnter, handleMouseLeave }}>
          <MazoCartaFigura ubicacion={1} />
        </PartidaContext.Provider>
      );
    });

    // Esperar a que las cartas se carguen y verificar que se muestran correctamente
    await waitFor(() => {
      expect(screen.getByAltText('Carta de Figura 4')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de Figura 5')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de Figura 6')).toBeInTheDocument();
    });

    // Verificar que el fetch fue llamado una vez
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('Simula eventos de mouse en las cartas', async () => {
    await act(async () => {
      render(
        <PartidaContext.Provider value={{ handleMouseEnter, handleMouseLeave }}>
          <MazoCartaFigura ubicacion={0} />
        </PartidaContext.Provider>
      );
    });

    // Verificar que el evento onMouseEnter se dispara correctamente
    const carta = await screen.findByAltText('Carta de Figura 1');
    act(() => {
      carta.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });
    expect(handleMouseEnter).toHaveBeenCalled();

    // Verificar que el evento onMouseLeave se dispara correctamente
    act(() => {
      carta.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    });
    expect(handleMouseLeave).toHaveBeenCalled();
  });
});
