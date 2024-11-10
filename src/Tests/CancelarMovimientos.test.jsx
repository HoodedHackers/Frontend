import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PartidaContext } from '../components/Partida/PartidaProvider.jsx';
import CancelarMovimientos from '../components/Partida/CancelarMovimiento/CancelarMovimientos.jsx';
import { vi } from 'vitest';

// Mock de console.error para suprimir errores en el test
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('CancelarMovimientos', () => {
  it('debe renderizar el botón y cancelar los movimientos cuando se haga clic', async () => {
    // Simulando sessionStorage
    sessionStorage.setItem("identifier", "test-identifier");
    sessionStorage.setItem("partida_id", "test-game-id");

    const setCancelarHabilitado = vi.fn();

    // Mock de fetch para simular la respuesta exitosa del backend
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    // Renderizando el componente dentro del proveedor de contexto
    render(
      <PartidaContext.Provider value={{ partidaIniciada: true, setCancelarHabilitado }}>
        <CancelarMovimientos />
      </PartidaContext.Provider>
    );

    // Verificar que el botón esté en el documento
    const button = screen.getByText('Cancelar Movimientos');
    expect(button).toBeInTheDocument();

    // Simular clic en el botón
    fireEvent.click(button);

    // Esperar a que setCancelarHabilitado se haya llamado con false
    await waitFor(() => expect(setCancelarHabilitado).toHaveBeenCalledWith(false));

    // Verificar que fetch se llamó con la URL y configuración esperadas
    expect(global.fetch).toHaveBeenCalledWith(`http://127.0.0.1:8000/api/game/test-game-id/undo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'test-identifier' }),
    });
  });

  it('no debe mostrar el botón si partidaIniciada es false', () => {
    render(
      <PartidaContext.Provider value={{ partidaIniciada: false, setCancelarHabilitado: vi.fn() }}>
        <CancelarMovimientos />
      </PartidaContext.Provider>
    );

    // El botón no debe estar presente si partidaIniciada es false
    const button = screen.queryByText('Cancelar Movimientos');
    expect(button).toBeNull();
  });

  it('debe manejar los errores de fetch correctamente', async () => {
    // Simulando un error en la llamada fetch
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Error al cancelar los movimientos'));

    sessionStorage.setItem("identifier", "test-identifier");
    sessionStorage.setItem("partida_id", "test-game-id");

    const setCancelarHabilitado = vi.fn();

    render(
      <PartidaContext.Provider value={{ partidaIniciada: true, setCancelarHabilitado }}>
        <CancelarMovimientos />
      </PartidaContext.Provider>
    );

    const button = screen.getByText('Cancelar Movimientos');
    fireEvent.click(button);

    // Verificar que se haya registrado el error en la consola
    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith('Error al deshacer el movimiento:', expect.any(Error))
    );
  });
});
