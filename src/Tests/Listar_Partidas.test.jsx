import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import Listar_Partidas from '../Listar_Partidas';

describe('Listar_Partidas Component', () => {
    const partidas = [
        { id: 1, nombre: 'Partida Milo', jugadores: 2, max_jugadores: 4 },
        { id: 2, nombre: 'Partida Ely', jugadores: 2, max_jugadores: 4 },
        { id: 3, nombre: 'Partida Ema', jugadores: 2, max_jugadores: 4 },
        { id: 4, nombre: 'Partida Andy', jugadores: 2, max_jugadores: 4 },
        { id: 5, nombre: 'Partida Lou', jugadores: 2, max_jugadores: 4 },
        { id: 6, nombre: 'Partida Lu', jugadores: 2, max_jugadores: 4 },
        { id: 7, nombre: 'Partida Mati', jugadores: 2, max_jugadores: 4 }
      ];

    beforeEach(() => {
        render(
            <MemoryRouter>
              <Listar_Partidas />
            </MemoryRouter>
          );
    });

    it('Renderiza el mensaje de "No hay partidas disponibles" cuando no hay partidas', () => {
      const mensaje = screen.getByText('No hay partidas disponibles en este momento. Por favor, intente crear una partida.');
      expect(mensaje).toBeInTheDocument();
    });

    it('Renderiza una lista de partidas correctamente', () => {
      render(
        <MemoryRouter>
          <Listar_Partidas partidas={partidas} />
        </MemoryRouter>
      );

      const partidaItems = screen.getAllByRole('listitem');

      expect(partidaItems.length).toBe(partidas.length);
      expect(screen.getByText('Partida Milo')).toBeInTheDocument();
      expect(screen.getByText('Partida Ely')).toBeInTheDocument();
      expect(screen.getByText('Partida Ema')).toBeInTheDocument();
      expect(screen.getByText('Partida Andy')).toBeInTheDocument();
      expect(screen.getByText('Partida Lou')).toBeInTheDocument();
      expect(screen.getByText('Partida Lu')).toBeInTheDocument();
      expect(screen.getByText('Partida Mati')).toBeInTheDocument();
    });

    // it('Permite al usuario unirse a una partida', () => {
    //     const unirseButton = screen.getByRole('button', { name: /Unirse/i });
// 
    //     fireEvent.click(unirseButton);
// 
    //     expect(unirseButton).toBeDisabled();
    // });
})