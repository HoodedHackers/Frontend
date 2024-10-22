import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import PasarTurno from '../components/Partida/PasarTurno/PasarTurno.jsx';


// Función de renderizado que envuelve el componente
const renderComponent = (props) => {
  return render(<PasarTurno {...props} />);
};

describe('PasarTurno', () => {
  beforeEach(() => {
    // Simula sessionStorage
    sessionStorage.setItem('partida_id', '1234');
    sessionStorage.setItem('identifier', 'player1');
  });

  afterEach(() => {
    // Limpia sessionStorage después de cada prueba
    sessionStorage.clear();
  });

  it('renderiza el botón "Terminar Turno"', () => {
    renderComponent({ onTurnoCambiado: vi.fn(), tiempoLimite: 30, setTimeLeft: vi.fn(), disabled: false });

    const button = screen.getByRole('button', { name: /Terminar Turno/i });
    expect(button).toBeInTheDocument();
  });

  it('deshabilita el botón cuando la prop disabled es true', () => {
    renderComponent({ onTurnoCambiado: vi.fn(), tiempoLimite: 30, setTimeLeft: vi.fn(), disabled: true });

    const button = screen.getByRole('button', { name: /Terminar Turno/i });
    expect(button).toBeDisabled();
  });

  it('no llama a pasarTurno si identifier no está en sessionStorage', async () => {
    sessionStorage.removeItem('identifier'); // Elimina el identifier

    const mockOnTurnoCambiado = vi.fn();
    const mockSetTimeLeft = vi.fn();

    renderComponent({ onTurnoCambiado: mockOnTurnoCambiado, tiempoLimite: 30, setTimeLeft: mockSetTimeLeft, disabled: false });

    const button = screen.getByRole('button', { name: /Terminar Turno/i });

    // Simular el clic en el botón
    await fireEvent.click(button);

    // Verifica que no se llama a onTurnoCambiado
    expect(mockOnTurnoCambiado).not.toHaveBeenCalled();
  });

  it('maneja errores de conexión correctamente', async () => {
    const mockOnTurnoCambiado = vi.fn();
    const mockSetTimeLeft = vi.fn();

    // Mock de la respuesta de fetch para simular un error
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    renderComponent({ onTurnoCambiado: mockOnTurnoCambiado, tiempoLimite: 30, setTimeLeft: mockSetTimeLeft, disabled: false });

    const button = screen.getByRole('button', { name: /Terminar Turno/i });

    // Simular el clic en el botón
    await fireEvent.click(button);

    // Verifica que no se llama a onTurnoCambiado
    expect(mockOnTurnoCambiado).not.toHaveBeenCalled();
  });
});
