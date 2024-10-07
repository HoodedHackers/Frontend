import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CartaMovimiento from '../components/Partida/CartasMovimiento/CartaMovimiento';
import CartasMovimientoMano from '../components/Partida/CartasMovimiento/CartasMovimientoMano';

describe('Cartas_Movimiento', () => {
  let cartaMovimientos = [
     { player: 1, cards_out: [{ card_id: 30, card_name: "Soy Movimiento" },
       { card_id: 21, card_name: "Soy Movimiento" },
       { card_id: 43, card_name: "Soy Movimiento" }] 
     }
  ];

  const handleMouseEnter = () => {
    setIsOverlayVisible(true);
  };
  
  const handleMouseLeave = () => {
    setIsOverlayVisible(false);
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Renderiza cartas', () => {
    // Crea un mock para useState
    const setState = vi.fn();
    const useStateMock = () => [cartaMovimientos, setState];

    vi.spyOn(React, 'useState').mockImplementationOnce(useStateMock);

    // Renderiza el componente con el mock
    render(<CartasMovimientoMano ubicacion={0} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />);

    // Verifica que las cartas están presentes
    expect(screen.getByAltText("Carta de Movimiento 3")).toBeInTheDocument();
    expect(screen.getByAltText("Carta de Movimiento 1")).toBeInTheDocument();
    expect(screen.getByAltText("Carta de Movimiento 2")).toBeInTheDocument();
  });

  it('Se renderizan todos los tipos de cartas de movimiento', () => {
    const tipos = [0, 1, 2, 3, 4, 5, 6, 7]; // Tipos de carta a verificar

    // Renderiza una carta por cada tipo
    tipos.forEach((tipo) => {
      render(<CartaMovimiento tipo={tipo} />);
      const imagen = screen.getByAltText(`Carta de Movimiento ${tipo}`);
      
      // Verifica que la imagen esté en el documento
      expect(imagen).toBeInTheDocument();

      // También puedes verificar que la src de la imagen sea la esperada
      const expectedSrc = `/Imagenes/Movimiento/${tipo === 0 ? 'back-mov' : `mov${tipo}`}.svg`;
      expect(imagen.src).toContain(expectedSrc);
    });
  });

  it('Se alterna entre 0 y 3 cartas por jugador', () => {
    // Crea un mock para useState
    const setState = vi.fn((cartasActuales) => {
      cartaMovimientos = typeof cartasActuales === 'function' ? cartasActuales(cartaMovimientos) : cartasActuales;
      rerender(<CartasMovimientoMano ubicacion={0} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />);
    });
    const useStateMock = () => [cartaMovimientos, setState];

    // Simula el useState de todos los componentes antes de renderizar
    vi.spyOn(React, 'useState').mockImplementation(useStateMock);

    // Renderiza el componente por primera vez
    const { rerender } = render(<CartasMovimientoMano ubicacion={0} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />);

    // Verifica que las cartas están presentes
    expect(screen.getByAltText("Carta de Movimiento 3")).toBeInTheDocument();
    expect(screen.getByAltText("Carta de Movimiento 1")).toBeInTheDocument();
    expect(screen.getByAltText("Carta de Movimiento 2")).toBeInTheDocument();

    // Simula haber quitado 1 carta
    let cartaMovimientos1 = [
      { player: 1, cards_out: [{ card_id: 30, card_name: "Soy Movimiento" },
        { card_id: 21, card_name: "Soy Movimiento" }] 
      }
    ];

    // Quita la última carta
    setState(cartaMovimientos1);
    
    // Verifica que las cartas están presentes
    expect(screen.getByAltText("Carta de Movimiento 3")).toBeInTheDocument();
    expect(screen.getByAltText("Carta de Movimiento 1")).toBeInTheDocument();

    // Simula haber quitado 2 cartas
    let cartaMovimientos2 = [
      { player: 1, cards_out: [{ card_id: 30, card_name: "Soy Movimiento" }] 
      }
    ];

    // Quita la última carta
    setState(cartaMovimientos2);
    
    // Verifica que las cartas están presentes
    expect(screen.getByAltText("Carta de Movimiento 3")).toBeInTheDocument();

    // Simula haber quitado todas las cartas
    let cartaMovimientos3 = [
      { player: 1, cards_out: [] }
    ];

    // Quita la última carta
    setState(cartaMovimientos3);

    // Verifica que no hay cartas
    expect(screen.queryByAltText("Carta de Movimiento 3")).toBeNull();
  });
});
