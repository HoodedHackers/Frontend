import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AbandonarPartida from '../components/Partida/AbandonarPartida/AbandonarPartida.jsx';
import { useNavigate } from 'react-router-dom';

// Mockear el useNavigate para verificar si se llama correctamente
const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate, // Aquí aseguramos que useNavigate sea una función mockeada
}));

describe('AbandonarPartida', () => {
  it('Renderiza correctamente el botón de abandonar partida', () => {
    render(<AbandonarPartida />);
    
    const abandonarButton = screen.getByText(/Abandonar Partida/i);
    expect(abandonarButton).toBeInTheDocument();  // Comprueba que el botón se renderiza
  });

  it('Redirige a /Opciones cuando la respuesta es exitosa', async () => {
    // Mockear fetch para devolver una respuesta exitosa
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            players: [{ name: 'Player 1' }],
          }),
      })
    );

    render(<AbandonarPartida />);
    
    const abandonarButton = screen.getByText(/Abandonar Partida/i);
    fireEvent.click(abandonarButton);
    
    // Espera a que se complete la operación y se verifique que se ha redirigido
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/Opciones');  // Verifica que se navega a '/opciones'
    });

    global.fetch.mockClear();
  });
});