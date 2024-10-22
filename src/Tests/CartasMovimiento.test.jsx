import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CartaMovimiento from '../components/Partida/CartasMovimiento/CartaMovimiento';
import { CartasMovimientoMano, CartasMovimientoContext } from '../components/Partida/CartasMovimiento/CartasMovimientoMano';
import { PartidaContext } from '../components/Partida/PartidaProvider';
import { WebSocketProvider } from '../components/WebSocketsProvider';

vi.mock('../components/Partida/PartidaProvider');

// Mock de los datos del contexto
const jugadores = [
    { id: 1, player_name: 'Jugador 1' }
  ];

// Mock de los datos de las cartas de movimiento
let cartaMovimientosMock = [
  { player_id: 1, all_cards: [30, 21, 43] }
];

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
      <WebSocketProvider>
        <PartidaContext.Provider value={{ jugadores, partidaIniciada }}>
          <CartasMovimientoMano 
            ubicacion={0}
          />
        </PartidaContext.Provider>
      </WebSocketProvider>  
    );

    // Verifica que las cartas están presentes y se renderizan boca abajo
    const cartasBocaAbajo = screen.getAllByAltText("Carta de Movimiento 0");
    expect(cartasBocaAbajo).toHaveLength(3);
  });

  it('Se conecta al endpoint para obtener las cartas', async () => {
    const partidaIniciada = true;
    // Mock de la respuesta del fetch
    const responseMock =   { player_id: 1, all_cards: [30, 21, 43] };

    // Simula el fetch para devolver la respuesta simulada
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(responseMock),  // Simula la respuesta en formato JSON
    });

    // Renderiza el componente
    render(
      <WebSocketProvider>
        <PartidaContext.Provider value={{ jugadores, partidaIniciada }}>
          <CartasMovimientoMano 
            ubicacion={0}
          />
        </PartidaContext.Provider>
      </WebSocketProvider> 
    );

    // Espera a que fetch sea llamado con los parámetros correctos
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('http://127.0.0.1:8000/api/partida/en_curso/movimiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: parseInt(sessionStorage.getItem("partida_id"), 10),
          player: sessionStorage.getItem("identifier")
        })
      });
    });

    // Verifica que las cartas están presentes
    expect(screen.getByAltText("Carta de Movimiento 3")).toBeInTheDocument();
    expect(screen.getByAltText("Carta de Movimiento 1")).toBeInTheDocument();
    expect(screen.getByAltText("Carta de Movimiento 2")).toBeInTheDocument();
  });

  it('Se renderizan todos los tipos de cartas de movimiento', () => {
    const tipos = [-1, 0, 1, 2, 3, 4, 5, 6]; // Tipos de carta a verificar
    const seleccionada = null;

    // Renderiza una carta por cada tipo
    tipos.forEach((tipo) => {
      render(
        <WebSocketProvider>
        <PartidaContext.Provider value={{ jugadores }}>
          <CartasMovimientoContext.Provider value={{seleccionada}}> 
            <CartaMovimiento 
              id={tipo}
            />
          </CartasMovimientoContext.Provider>  
        </PartidaContext.Provider>
      </WebSocketProvider> 
      );
      const imagen = screen.getByAltText(`Carta de Movimiento ${tipo + 1}`);
      
      // Verifica que la imagen esté en el documento
      expect(imagen).toBeInTheDocument();

      const expectedSrc = `/Imagenes/Movimiento/${tipo + 1 === 0 ? 'back-mov' : `mov${tipo + 1}`}.svg`;
      expect(imagen.src).toContain(expectedSrc);
    });
  });

  it('Renderiza correctamente 2 cartas', async () => {
    const partidaIniciada = true;

    // Simula haber quitado 1 carta
    const responseMock1 = { player_id: 1, all_cards: [30, 21] };

    // Simula el fetch para devolver la respuesta simulada
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(responseMock1),  // Simula la respuesta en formato JSON
    });

    // Renderiza el componente
    render(
      <WebSocketProvider>
        <PartidaContext.Provider value={{ jugadores, partidaIniciada }}>
          <CartasMovimientoMano 
            ubicacion={0}
          />
        </PartidaContext.Provider>
      </WebSocketProvider> 
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
    const responseMock2 = { player_id: 1, all_cards: [30] };

    // Simula el fetch para devolver la respuesta simulada
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(responseMock2),  // Simula la respuesta en formato JSON
    });

    // Renderiza el componente
    render(
      <WebSocketProvider>
        <PartidaContext.Provider value={{ jugadores, partidaIniciada }}>
          <CartasMovimientoMano 
            ubicacion={0}
          />
        </PartidaContext.Provider>
      </WebSocketProvider> 
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
      player_id: 1, all_cards: []
    };

    // Simula el fetch para devolver la respuesta simulada
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(responseMock3),  // Simula la respuesta en formato JSON
    });

    // Renderiza el componente
    render(
      <WebSocketProvider>
        <PartidaContext.Provider value={{ jugadores, partidaIniciada }}>
          <CartasMovimientoMano 
            ubicacion={0}
          />
        </PartidaContext.Provider>
      </WebSocketProvider> 
    );
    
    // Verifica que las cartas no están presentes
    await waitFor(() => {
      expect(screen.queryByText("Carta de Movimiento 3")).not.toBeInTheDocument();
      expect(screen.queryByText("Carta de Movimiento 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Carta de Movimiento 2")).not.toBeInTheDocument();
    });
  });  

  it('Se conecta con el WebSocket de Usar Carta de Movimiento', async () => {
    // NO SE TESTEAR WEBSOCKETS
  });

  it('Muestra un error si el WebSocket de Usar Carta de Movimiento falla', async () => {
    // NO SE TESTEAR WEBSOCKETS
  });

  it('Se puede seleccionar una carta de movimiento', () => {
    // NO SE TESTEAR WEBSOCKETS
  });
  
  it('Solo se puede seleccionar una carta de movimiento', () => {
    // NO SE TESTEAR WEBSOCKETS
  });  

});
