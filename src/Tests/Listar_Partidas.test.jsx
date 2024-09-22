import { describe, it, vi, afterEach, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from "react-router-dom";
import Listar_Partidas from '../Listar_Partidas';

const ACCIONES = {
  ACTUALIZACION_EN_PARTIDAS: 'actualizacion_en_partidas',
  RESPUESTA_UNION: 'respuesta_union',
  AGREGAR_JUGADOR:'agregar_jugador'
};

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
    
    // Mock del WebSocket
    const wsMock = {
      send: vi.fn(),
      onmessage: null,
      close: vi.fn(),
    };

    // Simular la creación de un WebSocket
    vi.spyOn(window, 'WebSocket').mockImplementation(() => wsMock);

    render(
      <BrowserRouter>
          <Listar_Partidas />
      </BrowserRouter>
    );
        
    // Espera a que las partidas sean renderizadas
    await waitFor(() => {
      const unirseButton = screen.getByRole('button', { name: /Unirse/i });
      fireEvent.click(unirseButton);

      // Simula la respuesta del WebSocket
      wsMock.onmessage({ data: JSON.stringify({ action: ACCIONES.RESPUESTA_UNION, partidaId: 1, success: true }) });
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
    
    // Mock del WebSocket
    const wsMock = {
      close: vi.fn(), // Mock de la función close
    };
  
    // Mock de la implementación del WebSocket
    vi.spyOn(window, 'WebSocket').mockImplementation(() => wsMock);

    render(
      <MemoryRouter>
        <Listar_Partidas />
      </MemoryRouter>
    );

    const unirseButton = await screen.findByRole('button', { name: /Unirse/i });

    expect(unirseButton).toBeDisabled();
  });

  it('Vuelve a renderizar cuando recibe un mensaje del ws', async () => {
    // Mock del WebSocket
    const wsMock = {
      send: vi.fn(),
      onmessage: null,
      close: vi.fn(),
    };

    // Mock de la implementación del WebSocket
    vi.spyOn(window, 'WebSocket').mockImplementation(() => wsMock);

    // Mock del fetch inicial
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, nombre: 'Partida Milo', jugadores: 1, max_jugadores: 4 }]),
      })
    );

    render(
      <MemoryRouter>
        <Listar_Partidas />
      </MemoryRouter>
    );

    // Verificar que la primera partida se renderiza
    expect(await screen.findByText(/Partida Milo/i)).toBeInTheDocument();

    // Simular que recibe un mensaje del WebSocket que indica actualización de partidas
    wsMock.onmessage({ data: JSON.stringify({ action: ACCIONES.ACTUALIZACION_EN_PARTIDAS }) });

    // Mock de fetch para que retorne 4 partidas
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, nombre: 'Partida Milo', jugadores: 1, max_jugadores: 4 },
          { id: 2, nombre: 'Partida Ely', jugadores: 2, max_jugadores: 4 },
          { id: 3, nombre: 'Partida Ema', jugadores: 3, max_jugadores: 4 },
          { id: 4, nombre: 'Partida Andy', jugadores: 4, max_jugadores: 4 }
        ]),
      })
    );
    
    // Esperar a que se rendericen las nuevas partidas
    await waitFor(() => {
      expect(screen.getByText(/Partida Milo/i)).toBeInTheDocument();
      expect(screen.getByText(/Partida Ely/i)).toBeInTheDocument();
      expect(screen.getByText(/Partida Ema/i)).toBeInTheDocument();
      expect(screen.getByText(/Partida Andy/i)).toBeInTheDocument();
    });

    // Simular otro mensaje del WebSocket
    wsMock.onmessage({ data: JSON.stringify({ action: ACCIONES.ACTUALIZACION_EN_PARTIDAS }) });

    // Mock para que retorne partidas actualizadas
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, nombre: 'Partida Milo', jugadores: 2, max_jugadores: 4 }, // Jugador se unio
          { id: 2, nombre: 'Partida Ely', jugadores: 2, max_jugadores: 4 }, // Jugador se fue
          { id: 3, nombre: 'Partida Ema', jugadores: 2, max_jugadores: 4 }
        ]),
      })
    );

    // Esperar a que se rendericen las actualizaciones
    await waitFor(() => {
      expect(screen.getByText(/Partida Milo/i)).toBeInTheDocument();
      expect(screen.getByText(/Partida Ely/i)).toBeInTheDocument();
      expect(screen.getByText(/Partida Ema/i)).toBeInTheDocument();
      expect(screen.queryByText(/Partida Andy/i)).not.toBeInTheDocument();
    });
    
    // Simular un último mensaje del WebSocket que indica que no hay partidas disponibles
    wsMock.onmessage({ data: JSON.stringify({ action: ACCIONES.ACTUALIZACION_EN_PARTIDAS }) });

    // Mock para que retorne un estado sin partidas
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    // Verificar que el mensaje de "no hay partidas" se renderiza
    await waitFor(() => {
      const mensaje = screen.findByText('No hay partidas disponibles en este momento. Por favor, intente crear una partida.');
      expect(mensaje).toBeInTheDocument();
    });
  });
});