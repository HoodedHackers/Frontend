import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen ,act} from "@testing-library/react";
import Temporizador from "../components/Partida/Temporizador/Temporizador.jsx";

// Mocks de audio y WebSocket
const mockAudioPlay = vi.fn();
const mockAudioRef = { current: { play: mockAudioPlay } };
global.WebSocket = vi.fn(() => ({
  onopen: vi.fn(),
  send: vi.fn(),
  close: vi.fn(),
}));

describe('Temporizador', () => {
  const tiempoLimite = 30; // 30 segundos de límite
  const jugadorActual = 'Jugador 1';
  const onFinTurno = vi.fn();

  beforeEach(() => {
    // Reiniciar el mock de audio antes de cada prueba
    mockAudioPlay.mockClear();
    sessionStorage.clear(); // Limpiar el sessionStorage antes de cada prueba
  });


  it('debería inicializar la conexión WebSocket y enviar el mensaje de inicio', () => {
    render(<Temporizador tiempoLimite={tiempoLimite} jugadorActual={jugadorActual} onFinTurno={onFinTurno} />);
    
    expect(global.WebSocket).toHaveBeenCalledWith("http://127.0.0.1:8000/ws/timer");
  });
});
