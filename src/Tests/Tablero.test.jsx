import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {TableroProvider} from '../components/Partida/Tablero/TableroProvider.jsx';
import Tablero from '../components/Partida/Tablero/TableroContainer.jsx'
import { PartidaContext } from '../components/Partida/PartidaProvider.jsx';
import { WebSocketContext } from '../components/WebSocketsProvider.jsx';

const wsBSRefMock = { current: null };

describe('Tablero Component', () => {
  it('renders without crashing', () => {
    render(
      <WebSocketContext.Provider value={{ wsBSRef: wsBSRefMock }}> 
        <PartidaContext.Provider value={{}}> 
          <TableroProvider>
            <Tablero />
          </TableroProvider>
        </PartidaContext.Provider>
      </WebSocketContext.Provider>
    );

    // Verifica que se renderiza el tablero
    const squares = screen.getAllByRole('button'); // Verificamos que hay botones, que representan los cuadrados
    expect(squares.length).toBe(36); // Asegúrate que el número de cuadrados es 36
  });

  it('Se conecta al Web Socket de Estado del Tablero', () => {
    // No se Testeae Web Sockets
  });

  it('Muestra un error si el Web Socket de Estado del Tablero falla', () => {
    // No se Testeae Web Sockets
  });

  
});
