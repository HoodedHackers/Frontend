import { describe, it, vi, afterEach, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from "react-router-dom";
import Listar_Partidas from '../Listar_Partidas';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

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
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Renderiza un mensaje cuando no hay partidas', async () => {
    // Simula un mock de fetch para que devuelva un array vacío
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]), // Devuelve un array vacío
      })
    );

    render(
      <MemoryRouter>
        <Listar_Partidas />
      </MemoryRouter>
    );

    // Espera a que el mensaje sea renderizado
    const mensaje = await screen.findByText('No hay partidas disponibles en este momento. Por favor, intente crear una partida.');

    expect(mensaje).toBeInTheDocument();
  });

  it('Realiza el fetch inicial', async () => {
    // Mock de fetch para simular una respuesta exitosa (puedes ajustar esto según sea necesario)
    const fetchMock = vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );
  
    render(
      <MemoryRouter>
        <Listar_Partidas />
      </MemoryRouter>
    );
  
    // Espera a que fetch sea llamado
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('http://127.0.0.1:8000/api/lobby');
    });
  });

  it('Muestra un error si el fetch falla', async () => {
    // Mock de console.error
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
  
    // Mock de la función fetch para simular una respuesta fallida
    const fetchMock = vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve([]), // Simulando respuesta vacía
      })
    );
  
    // Renderizamos el componente
    render(<Listar_Partidas />);
  
    // Esperamos a que fetch sea llamado
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  
    // Verificamos si se llamó a console.error con el mensaje de error esperado
    expect(consoleErrorMock).toHaveBeenCalledWith(new Error('No se pudo obtener las partidas'));
  
    // Limpieza de los mocks
    fetchMock.mockRestore();
    consoleErrorMock.mockRestore();
  });

  it('Renderiza una lista de partidas correctamente', async () => {
    // Simula un mock de fetch para simular una respuesta exitosa con partidas
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(partidas),
      })
    );
  
    render(
      <MemoryRouter>
        <Listar_Partidas />
      </MemoryRouter>
    );

    // Espera a que las partidas sean renderizadas
    await waitFor(() => {
      const partidaItems = screen.getAllByRole('listitem');
      expect(partidaItems.length).toBe(partidas.length);
  
      // Verifica que cada partida esté en el documento
      expect(screen.getByText('Partida Milo')).toBeInTheDocument();
      expect(screen.getByText('Partida Ely')).toBeInTheDocument();
      expect(screen.getByText('Partida Ema')).toBeInTheDocument();
      expect(screen.getByText('Partida Andy')).toBeInTheDocument();
      expect(screen.getByText('Partida Lou')).toBeInTheDocument();
      expect(screen.getByText('Partida Lu')).toBeInTheDocument();
      expect(screen.getByText('Partida Mati')).toBeInTheDocument();
    });
  });

  it('Permite al usuario unirse a una partida', async () => {
    // Simula un mock de fetch para simular una respuesta exitosa con partidas
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, nombre: 'Partida Milo', jugadores: 1, max_jugadores: 4 }]),
      })
    );

    render(
      <BrowserRouter>
          <Listar_Partidas />
      </BrowserRouter>
    );
        
    // Espera a que las partidas sean renderizadas
    await waitFor(() => {
      const unirseButton = screen.getByRole('button', { name: /Unirse/i });
      fireEvent.click(unirseButton);
    });

    expect(navigateMock).toHaveBeenCalledWith('/Partida/1');
  });

  it('Desactiva el botón de unirse a una partida cuando la partida está llena', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, nombre: 'Partida Milo', jugadores: 4, max_jugadores: 4 }]),
      })
    );
    
    render(
      <MemoryRouter>
        <Listar_Partidas />
      </MemoryRouter>
    );

    const unirseButton = await screen.findByRole('button', { name: /Unirse/i });

    expect(unirseButton).toBeDisabled();
  });

});