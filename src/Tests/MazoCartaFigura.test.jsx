import { render, screen, waitFor, act } from '@testing-library/react';
import MazoCartaFigura from '../components/MazoCartaFigura';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MazoCartaFigura Component', () => {
  beforeEach(() => {
    // Simular valores de localStorage antes de cada prueba
    const mockPartidaId = '12345';
    const mockJugadores = [
      { identifier: '1', name: 'Jugador 1' },
      { identifier: '2', name: 'Jugador 2' }
    ];
    localStorage.setItem('partidaId', mockPartidaId);
    localStorage.setItem('jugadores', JSON.stringify(mockJugadores));

    // Mockear la respuesta del backend
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

  it('Renderiza correctamente sin cartas iniciales', async () => {
    await act(async () => {
      render(<MazoCartaFigura />);
    });
    const container = screen.queryByText(/No hay cartas disponibles/i); // Ajusta según tu diseño de componente
    expect(container).not.toBeInTheDocument(); // Verificamos si no hay cartas cuando se carga por primera vez
  });

  it('Hace una llamada fetch y actualiza el mazo de cartas', async () => {
    await act(async () => {
      render(<MazoCartaFigura />);
    });

    // Esperar a que el mazo de cartas se actualice
    await waitFor(() => {
      expect(screen.getByAltText('Carta de figura 1')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de figura 2')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de figura 3')).toBeInTheDocument();
    });

    // Asegurarse de que el fetch fue llamado
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('Renderiza las cartas de los jugadores correctamente', async () => {
    await act(async () => {
      render(<MazoCartaFigura />);
    });

    // Esperar a que las cartas se carguen y verificar que se muestran correctamente
    await waitFor(() => {
      expect(screen.getByAltText('Carta de figura 1')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de figura 2')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de figura 3')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de figura 4')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de figura 5')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de figura 6')).toBeInTheDocument();
    });

    // Verificar que el fetch fue llamado una vez
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});