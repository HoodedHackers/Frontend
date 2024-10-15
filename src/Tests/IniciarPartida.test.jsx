import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, beforeEach, expect, vi, afterEach } from 'vitest';
import IniciarPartida from '../components/Partida/IniciarPartida/IniciarPartida.jsx';
import { PartidaProvider } from '../components/Partida/PartidaProvider.jsx'; 
import { WebSocketContext } from "../components/WebSocketsProvider.jsx";


const mockWebSocket = {
  send: vi.fn(),
  close: vi.fn(),
  onopen: null,
  onclose: null,
  onmessage: null,
  onerror: null,
};

// Mock del WebSocket
global.WebSocket = vi.fn(() => mockWebSocket);

function renderWithProvider(component) {
  return render(
    <PartidaProvider>
      <WebSocketContext.Provider value={{ wsStartGameRef: { current: mockWebSocket } }}>
        {component}
      </WebSocketContext.Provider>
    </PartidaProvider>
  );
}

describe('IniciarPartida', () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem('partida_id', '12345');
    sessionStorage.setItem('identifier', 'jugador1');
    sessionStorage.setItem('owner_identifier', 'jugador1'); // Simular que el jugador actual es el creador
    renderWithProvider(<IniciarPartida empezarPartida={vi.fn()} />);
  });

  afterEach(() => {
    vi.clearAllMocks();
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

    // Esperar a que la función termine
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

  it('envía un mensaje por WebSocket al iniciar la partida', async () => {
    const button = screen.getByRole('button', { name: /Iniciar Partida/i });
    
    fireEvent.click(button);
    
    // Esperar a que se envíe el mensaje
    await waitFor(() => {
      expect(mockWebSocket.send).toHaveBeenCalled();
      const sentMessage = JSON.parse(mockWebSocket.send.mock.calls[0][0]);
      expect(sentMessage.action).toBe("start");
      expect(sentMessage.jugadores).toContain('jugador1'); // Verifica que el jugador actual esté en la lista
    });
  });

  it('muestra un mensaje de error si la llamada falla', async () => {
    const button = screen.getByRole('button', { name: /Iniciar Partida/i });
    
    // Mockear un error en el fetch
    global.fetch = vi.fn(() => Promise.reject(new Error('Error al iniciar la partida')));
    
    fireEvent.click(button);

    // Esperar a que se muestre el error en el componente
    await waitFor(() => {
      expect(screen.getByText(/Error al iniciar la partida/i)).toBeInTheDocument();
    });
  });

  it('actualiza la lista de jugadores al recibir un mensaje de WebSocket', async () => {
    const button = screen.getByRole('button', { name: /Iniciar Partida/i });
    fireEvent.click(button);

    // Simular recibir un mensaje de WebSocket
    const mensajeSimulado = {
      action: "start",
      jugadores: ['jugador1', 'jugador2'],
    };
    await act(async () => {
      mockWebSocket.onmessage({ data: JSON.stringify(mensajeSimulado) });
    });

    // Verificar que el componente muestre la lista de jugadores
    expect(screen.getByText(/La partida ha comenzado/i)).toBeInTheDocument();
    expect(mockWebSocket.send).toHaveBeenCalled(); // Verificar que se envió un mensaje de inicio de partida
  });
}); 