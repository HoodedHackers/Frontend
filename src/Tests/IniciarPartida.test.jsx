import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import IniciarPartida from '../components/Partida/IniciarPartida/IniciarPartida.jsx';
import { PartidaProvider } from '../components/Partida/PartidaProvider.jsx'; // Asegúrate de que la ruta sea correcta

// Mock de fetch global
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

function renderWithProvider(component) {
  return render(
    <PartidaProvider>
      {component}
    </PartidaProvider>
  );
}

describe('IniciarPartida', () => {
  beforeEach(() => {
    renderWithProvider(<IniciarPartida />);
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

    // Esperar a que la petición termine
    await waitFor(() => expect(button).not.toBeDisabled());
  });

  it('muestra texto de carga al iniciar', async () => {
    const button = screen.getByRole('button', { name: /Iniciar Partida/i });
    
    fireEvent.click(button);
    
    // Verificar que el botón muestra "Iniciando..." mientras se espera
    expect(button).toHaveTextContent(/Iniciando.../i);
    
    // Esperar a que el texto vuelva al original después de la llamada
    await waitFor(() => expect(button).toHaveTextContent(/Iniciar Partida/i));
  });

  it('guarda el estado de la partida en sessionStorage después de iniciar', async () => {
    const button = screen.getByRole('button', { name: /Iniciar Partida/i });
    fireEvent.click(button);

    // Esperar que la partida haya iniciado y verificar sessionStorage
    await waitFor(() => expect(sessionStorage.getItem('partidaIniciada')).toBe('true'));
  });

  it('muestra error en consola si la llamada falla', async () => {
    // Mock para simular error en el fetch
    fetch.mockRejectedValueOnce(new Error('Error al iniciar la partida'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const button = screen.getByRole('button', { name: /Iniciar Partida/i });
    fireEvent.click(button);
    
    // Esperar que se muestre el error en la consola
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error al iniciar la partida:', expect.any(Error));
    });
    
    consoleErrorSpy.mockRestore();
  });
});



  
