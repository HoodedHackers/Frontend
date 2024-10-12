import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Jugador from '../components/Partida/jugador/jugador';

describe('Jugador', () => {

  it('Renderiza jugadores', () => {
    // Renderiza el componente
    render(<Jugador
            nombre = {'Jugador'}
            ubicacion = {1}
          />);

    expect(screen.getByText('Jugador')).toBeInTheDocument();
  });
});
