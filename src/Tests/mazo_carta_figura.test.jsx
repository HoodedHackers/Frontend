import { render, screen, waitFor, act } from '@testing-library/react';
import Mazo_Carta_Figura from '../components/Partida/carta_figura/mazo_carta_figura.jsx';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Mazo_Carta_Figura', () => {
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
      render(<Mazo_Carta_Figura />);
    });
    const container = screen.queryByText(/No hay cartas disponibles/i); // Ajusta según tu diseño de componente
    expect(container).not.toBeInTheDocument(); // Verificamos si no hay cartas cuando se carga por primera vez
  });

  it('Hace una llamada fetch y actualiza el mazo de cartas', async () => {
    await act(async () => {
      render(<Mazo_Carta_Figura />);
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
      render(<Mazo_Carta_Figura />);
    });

    // Esperar a que las cartas se carguen y verificar que se muestran correctamente
    await waitFor(() => {
      expect(screen.getByAltText('Carta de Figura 1')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de Figura 2')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de Figura 3')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de Figura 4')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de Figura 5')).toBeInTheDocument();
      expect(screen.getByAltText('Carta de Figura 6')).toBeInTheDocument();
    });

    // Verificar que el fetch fue llamado una vez
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
  it('Se alterna entre 0 y 3 cartas por jugador', () => {
    let cartaFigura = [
      { player: 1, cards_out: [{ card_id: 30, card_name: "Soy Figura" },
        { card_id: 21, card_name: "Soy Figura" },
        { card_id: 43, card_name: "Soy Figura" }] 
      }
    ];

    // Crea un mock para useState
    const setState = vi.fn((cartasActuales) => {
      cartaFigura = typeof cartasActuales === 'function' ? cartasActuales(cartaFigura) : cartasActuales;
      rerender(<Mazo_Carta_Figura ubicacion={0} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />);
    });
    const useStateMock = () => [cartaFigura, setState];

    // Simula el useState de todos los componentes antes de renderizar
    vi.spyOn(React, 'useState').mockImplementation(useStateMock);

    // Renderiza el componente por primera vez
    const { rerender } = render(<Mazo_Carta_Figura ubicacion={0} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />);

    // Verifica que las cartas están presentes
    expect(screen.getByAltText("Carta de Figura 6")).toBeInTheDocument();
    expect(screen.getByAltText("Carta de Figura 22")).toBeInTheDocument();
    expect(screen.getByAltText("Carta de Figura 19")).toBeInTheDocument();

    // Simula haber quitado 1 carta
    let cartaFigura1 = [
      { player: 1, cards_out: [{ card_id: 30, card_name: "Soy Figura" },
        { card_id: 21, card_name: "Soy Figura" }] 
      }
    ];

    // Quita la última carta
    setState(cartaFigura1);
    
    // Verifica que las cartas están presentes
    expect(screen.getByAltText("Carta de Figura 6")).toBeInTheDocument();
    expect(screen.getByAltText("Carta de Figura 22")).toBeInTheDocument();

    // Simula haber quitado 2 cartas
    let cartaFigura2 = [
      { player: 1, cards_out: [{ card_id: 30, card_name: "Soy Figura" }] 
      }
    ];

    // Quita la última carta
    setState(cartaFigura2);
    
    // Verifica que las cartas están presentes
    expect(screen.getByAltText("Carta de Figura 6")).toBeInTheDocument();

    // Simula haber quitado todas las cartas
    let cartaFigura3 = [
      { player: 1, cards_out: [] }
    ];

    // Quita la última carta
    setState(cartaFigura3);

    // Verifica que no hay cartas
    expect(screen.queryByAltText("Carta de Figura 6")).toBeNull();
  });
});