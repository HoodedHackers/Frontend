import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import TableroContainer from '../components/Partida/tablero/TableroContainer';

// Mock de WebSocket
global.WebSocket = class {
  constructor(url) {
    this.url = url;
    this.onopen = null;
    this.onmessage = null;
    this.onerror = null;
    this.readyState = 1; // OPEN
  }
  
  close() {
    this.readyState = 3; // CLOSED
  }
};

describe('Tablero', () => {
  beforeEach(() => {
    render(<TableroContainer jugadores={[]} />); // Renderizamos el componente sin jugadores
  });

  it('se renderiza correctamente con 36 cuadrados', () => {
    const squares = screen.getAllByRole('button'); // Asumiendo que los cuadrados son botones
    expect(squares).toHaveLength(36);
  });

});
