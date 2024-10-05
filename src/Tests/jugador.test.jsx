import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Partida from '../components/Partida/Partida';

describe('Jugador', () => {
  let jugadores = [
    { id: 1, name: "Jugador 1" },
    { id: 2, name: "Jugador 2" },
    { id: 3, name: "Jugador 3" },
    { id: 4, name: "Jugador 4" }
  ];

  let algunosJugadores = [
    { id: 1, name: "Jugador 1" },
    { id: 2, name: "Jugador 2" },
    { id: 4, name: "Jugador 4" }
  ];

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Renderiza jugadores', () => {
    // Crea un mock para useState
    const setState = vi.fn();
    const useStateMock = () => [jugadores, setState];

    // Simula el useState de todos los componentes antes de renderizar
    vi.spyOn(React, 'useState').mockImplementation(useStateMock);

    // Renderiza el componente
    render(<Partida />);

    expect(screen.getByText('Jugador 1')).toBeInTheDocument();
    expect(screen.getByText('Jugador 2')).toBeInTheDocument();
    expect(screen.getByText('Jugador 3')).toBeInTheDocument();
    expect(screen.getByText('Jugador 4')).toBeInTheDocument();
  });

  it('Se vuelve a renderizar cuando entran jugadores', () => {
    // Crea un mock para useState
    const setState = vi.fn((jugadoresActuales) => {
      algunosJugadores = typeof jugadoresActuales === 'function' ? jugadoresActuales(algunosJugadores) : jugadoresActuales;
      rerender(<Partida />);
    });
    const useStateMock = () => [algunosJugadores, setState];

    // Simula el useState de todos los componentes antes de renderizar
    vi.spyOn(React, 'useState').mockImplementation(useStateMock);

    // Renderiza el componente por primera vez
    const { rerender } = render(<Partida />);

    // Verifica que los jugadores iniciales están presentes
    expect(screen.getByText("Jugador 1")).toBeInTheDocument();
    expect(screen.getByText("Jugador 2")).toBeInTheDocument();
    expect(screen.getByText("Jugador 4")).toBeInTheDocument();

    // Agrega el jugador 3
    setState(jugadores);

    // Aquí, aunque no se vuelve a renderizar, puedes verificar que la lista de jugadores ha sido actualizada.
    expect(screen.getByText("Jugador 1")).toBeInTheDocument();
    expect(screen.getByText("Jugador 2")).toBeInTheDocument();
    expect(screen.getByText("Jugador 3")).toBeInTheDocument();
    expect(screen.getByText("Jugador 4")).toBeInTheDocument();
  });

  it('Se vuelve a renderizar cuando salen jugadores', () => {
    // Crea un mock para useState
    const setState = vi.fn((jugadoresActuales) => {
      jugadores = typeof jugadoresActuales === 'function' ? jugadoresActuales(jugadores) : jugadoresActuales;
      rerender(<Partida />);
    });
    const useStateMock = () => [jugadores, setState];

    // Simula el useState de todos los componentes antes de renderizar
    vi.spyOn(React, 'useState').mockImplementation(useStateMock);

    // Renderiza el componente por primera vez
    const { rerender } = render(<Partida />);

    // Verifica que los jugadores iniciales están presentes
    expect(screen.getByText("Jugador 1")).toBeInTheDocument();
    expect(screen.getByText("Jugador 2")).toBeInTheDocument();
    expect(screen.getByText("Jugador 3")).toBeInTheDocument();
    expect(screen.getByText("Jugador 4")).toBeInTheDocument();

    // Agrega el jugador 3
    setState(algunosJugadores);

    // Aquí, aunque no se vuelve a renderizar, puedes verificar que la lista de jugadores ha sido actualizada.
    expect(screen.getByText("Jugador 1")).toBeInTheDocument();
    expect(screen.getByText("Jugador 2")).toBeInTheDocument();
    expect(screen.getByText("Jugador 4")).toBeInTheDocument();
  });
});
