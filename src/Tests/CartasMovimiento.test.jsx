import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CartaMovimiento from '../components/Partida/CartasMovimiento/CartaMovimiento';
import { CartasMovimientoMano } from '../components/Partida/CartasMovimiento/CartasMovimientoMano';
import { PartidaContext } from '../components/Partida/PartidaProvider';
import { WebSocketProvider } from '../components/WebSocketsProvider';

sessionStorage.setItem('partida_id', 1); // Fijamos partida_id en 1

vi.mock('../components/Partida/PartidaProvider');

// Mock de los datos del contexto
const jugadores = [
    { player_id: 1, player_name: 'Jugador 1' }
  ];

// Mock de los datos de las cartas de movimiento
let cartasDelJugador = [30, 21, 43];

const activePlayer = { player_name: "PlayerTest", player_id: 1 };

const jugadorId = 1;

describe('Cartas de Movimiento', () => {

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Renderiza cartas boca abajo cuando la partida no inicio', () => {
    const partidaIniciada = false;

    // Renderiza el componente con los datos simulados
    render(
      <WebSocketProvider>
        <PartidaContext.Provider value={{ jugadores, partidaIniciada, cartasDelJugador, activePlayer }}>
          <CartasMovimientoMano 
            ubicacion={0}
            jugadorId={jugadorId}
          />
        </PartidaContext.Provider>
      </WebSocketProvider>  
    );

    // Verifica que las cartas están presentes y se renderizan boca abajo
    const cartasBocaAbajo = screen.getAllByAltText("Carta de Movimiento 0");
    expect(cartasBocaAbajo).toHaveLength(3);
  });

  it('Se renderizan todos los tipos de cartas de movimiento', () => {
    const tipos = [-1, 0, 1, 2, 3, 4, 5, 6]; // Tipos de carta a verificar
    const partidaIniciada = true;

    // Renderiza una carta por cada tipo
    tipos.forEach((tipo) => {
      render(
        <WebSocketProvider>
        <PartidaContext.Provider value={{ jugadores, partidaIniciada, activePlayer }}>
          <CartaMovimiento 
            id={tipo}
          /> 
        </PartidaContext.Provider>
      </WebSocketProvider> 
      );
      const imagen = screen.getByAltText(`Carta de Movimiento ${tipo + 1}`);
      
      // Verifica que la imagen esté en el documento
      expect(imagen).toBeInTheDocument();

      if (tipo === -1) {
        expect(imagen.src).toContain('back-mov.svg');
      }
      else if (tipo === 0) {
        expect(imagen.src).toContain('mov7.svg');
      }
      else if (tipo === 5) {
        expect(imagen.src).toContain('mov6.svg');
      }
      else if (tipo === 6) {
        expect(imagen.src).toContain('mov5.svg');
      }
      else {
        expect(imagen.src).toContain(`mov${tipo}.svg`);
      }
    });
  });

  it('Renderiza correctamente 2 cartas', async () => {
    const partidaIniciada = true;

    // Simula haber quitado 1 carta
    const cartasDelJugador = [30, 21];

    // Renderiza el componente
    render(
      <WebSocketProvider>
        <PartidaContext.Provider value={{ jugadores, partidaIniciada, cartasDelJugador, activePlayer }}>
          <CartasMovimientoMano 
            ubicacion={0}
            jugadorId={jugadorId}
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
    const cartasDelJugador = [30];

    // Renderiza el componente
    render(
      <WebSocketProvider>
        <PartidaContext.Provider value={{ jugadores, partidaIniciada, cartasDelJugador, activePlayer }}>
          <CartasMovimientoMano 
            ubicacion={0}
            jugadorId={jugadorId}
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
    const cartasDelJugador = [];

    // Renderiza el componente
    render(
      <WebSocketProvider>
        <PartidaContext.Provider value={{ jugadores, partidaIniciada, cartasDelJugador }}>
          <CartasMovimientoMano 
            ubicacion={0}
            jugadorId={jugadorId}
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
