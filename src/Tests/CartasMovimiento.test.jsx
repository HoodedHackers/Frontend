import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import CartaMovimiento from '../components/Partida/CartasMovimiento/CartaMovimiento';
import CartasMovimientoMano from '../components/Partida/CartasMovimiento/CartasMovimientoMano';
import { PartidaContext } from '../components/Partida/PartidaProvider';

vi.mock('../components/Partida/PartidaProvider');

// Mock de los datos del contexto
const jugadores = [
    { id: 1, name: 'Jugador 1' }
  ];

// Mock de los datos de las cartas de movimiento
let cartaMovimientosMock = [
  { player: 1, cards_out: [
    { card_id: 30, card_name: "Soy Movimiento" },
    { card_id: 21, card_name: "Soy Movimiento" },
    { card_id: 43, card_name: "Soy Movimiento" }] 
  }
];

// Mock de handleMouseEnter
const handleMouseEnterMock = () => {
 setIsOverlayVisible(true);
};

// Mock de handleMouseLeave
const handleMouseLeaveMock = () => {
 setIsOverlayVisible(false);
};

describe('Cartas de Movimiento', () => {

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Renderiza cartas boca abajo cuando la partida no inicio', () => {
    const partidaIniciada = false;

    // Mockea useState para devolver los datos simulados de cartaMovimientos
    vi.spyOn(React, 'useState').mockReturnValue([cartaMovimientosMock, vi.fn()]);

    // Renderiza el componente con los datos simulados
    render(
      <PartidaContext.Provider value={{ jugadores, partidaIniciada }}>
        <CartasMovimientoMano 
          ubicacion={0} 
          onMouseEnter={handleMouseEnterMock} 
          onMouseLeave={handleMouseLeaveMock} 
        />
      </PartidaContext.Provider>
    );

    // Verifica que las cartas están presentes y se renderizan boca abajo
    const cartasBocaAbajo = screen.getAllByAltText("Carta de Movimiento 0");
    expect(cartasBocaAbajo).toHaveLength(3);
  });

  it('Se conecta al endpoint para obtener las cartas', async () => {
    const partidaIniciada = true;

    // Mock de la respuesta del fetch
    const responseMock = { 
      player: 1, cards_out: [
        { card_id: 30, card_name: "Soy Movimiento" },
        { card_id: 21, card_name: "Soy Movimiento" },
        { card_id: 43, card_name: "Soy Movimiento" }] 
      };

    // Simula el fetch para devolver la respuesta simulada
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(responseMock),  // Simula la respuesta en formato JSON
    });

    // Renderiza el componente
    render(
      <PartidaContext.Provider value={{ jugadores, partidaIniciada }}>
        <CartasMovimientoMano 
          ubicacion={0} 
          onMouseEnter={handleMouseEnterMock} 
          onMouseLeave={handleMouseLeaveMock} 
        />
      </PartidaContext.Provider>
    );

    // Espera a que fetch sea llamado con los parámetros correctos
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('http://127.0.0.1:8000/api/partida/en_curso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: Number(sessionStorage.getItem('partida_id')),
          players: jugadores,
        })
      });
    });

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

  it('Renderiza correctamente 2 cartas', async () => {
    const partidaIniciada = true;

    // Simula haber quitado 1 carta
    const responseMock1 = {
      player: 1, cards_out: [
        { card_id: 30, card_name: "Soy Movimiento" },
        { card_id: 21, card_name: "Soy Movimiento" }
      ]};

    // Simula el fetch para devolver la respuesta simulada
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(responseMock1),  // Simula la respuesta en formato JSON
    });

    // Renderiza el componente
    render(
      <PartidaContext.Provider value={{ jugadores, partidaIniciada }}>
        <CartasMovimientoMano 
          ubicacion={0} 
          onMouseEnter={handleMouseEnterMock} 
          onMouseLeave={handleMouseLeaveMock} 
        />
      </PartidaContext.Provider>
    );

    // Verifica que las cartas están presentes
    await waitFor(() => {
      expect(screen.getByAltText("Carta de Movimiento 3")).toBeInTheDocument();
      expect(screen.getByAltText("Carta de Movimiento 1")).toBeInTheDocument();
      expect(screen.queryByText("Carta de Movimiento 2")).not.toBeInTheDocument();
    });  
  });

  it('Renderiza correctamente 1 carta', async () => {
    const partidaIniciada = true;

    // Simula haber quitado 2 cartas
    const responseMock2 = {
      player: 1, cards_out: [
        { card_id: 30, card_name: "Soy Movimiento" }
      ]};

    // Simula el fetch para devolver la respuesta simulada
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(responseMock2),  // Simula la respuesta en formato JSON
    });

    // Renderiza el componente
    render(
      <PartidaContext.Provider value={{ jugadores, partidaIniciada }}>
        <CartasMovimientoMano 
          ubicacion={0} 
          onMouseEnter={handleMouseEnterMock} 
          onMouseLeave={handleMouseLeaveMock} 
        />
      </PartidaContext.Provider>
    );

    // Verifica que la carta está presente
    await waitFor(() => {
      expect(screen.getByAltText("Carta de Movimiento 3")).toBeInTheDocument();
      expect(screen.queryByText("Carta de Movimiento 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Carta de Movimiento 2")).not.toBeInTheDocument();
    });
  });

  it ('Renderiza correctamente 0 cartas', async () => {
    const partidaIniciada = true;

    // Simula haber quitado 3 cartas
    const responseMock3 = {
      player: 1, cards_out: []
    };

    // Simula el fetch para devolver la respuesta simulada
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(responseMock3),  // Simula la respuesta en formato JSON
    });

    // Renderiza el componente
    render(
      <PartidaContext.Provider value={{ jugadores, partidaIniciada }}>
        <CartasMovimientoMano 
          ubicacion={0} 
          onMouseEnter={handleMouseEnterMock} 
          onMouseLeave={handleMouseLeaveMock} 
        />
      </PartidaContext.Provider>
    );
    
    // Verifica que las cartas no están presentes
    await waitFor(() => {
      expect(screen.queryByText("Carta de Movimiento 3")).not.toBeInTheDocument();
      expect(screen.queryByText("Carta de Movimiento 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Carta de Movimiento 2")).not.toBeInTheDocument();
    });
  });

});
