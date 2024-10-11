import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import IniciarPartida from "../components/Partida/IniciarPartida/IniciarPartida.jsx";

describe('IniciarPartida', () => {
  const mockOnIniciar = vi.fn().mockResolvedValueOnce(); // Simulate a resolved promise

  beforeEach(() => {
    render(<IniciarPartida onIniciar={mockOnIniciar} />);
  });

  it('se renderiza correctamente', () => {
    const button = screen.getByRole('button', { name: /Iniciar Partida/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('deshabilita el botón cuando está cargando', async () => {
    const button = screen.getByRole('button', { name: /Iniciar Partida/i });
    fireEvent.click(button);
    
    expect(button).toBeDisabled();
  });

  it('muestra texto de carga al iniciar', async () => {
    const button = screen.getByRole('button', { name: /Iniciar Partida/i });

    fireEvent.click(button);

    expect(button).toHaveTextContent(/Iniciando.../i);
  });

});