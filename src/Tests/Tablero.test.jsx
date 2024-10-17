import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {TableroProvider} from '../components/Partida/Tablero/TableroProvider.jsx';
import Tablero from '../components/Partida/Tablero/TableroContainer.jsx' // Asegúrate de importar tu componente Tablero real

describe('Tablero Component', () => {
  it('renders without crashing', () => {
    render(
      <TableroProvider>
        <Tablero />
      </TableroProvider>
    );

    // Verifica que se renderiza el tablero
    const squares = screen.getAllByRole('button'); // Verificamos que hay botones, que representan los cuadrados
    expect(squares.length).toBe(36); // Asegúrate que el número de cuadrados es 36
  });

  it('displays squares with correct background images', () => {
    render(
      <TableroProvider>
        <Tablero />
      </TableroProvider>
    );

    const squares = screen.getAllByRole('button');

    squares.forEach((square, index) => {
      // Verificamos que cada cuadrado tiene un fondo definido
      expect(square).toHaveStyle({ backgroundSize: 'cover' });
      expect(square).toHaveStyle({ backgroundPosition: 'center' });
    });
  });
});
