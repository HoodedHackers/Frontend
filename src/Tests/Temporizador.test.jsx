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
  const time = 30; // 30 segundos de límite
  const currentPlayer = 'Jugador 1';

  beforeEach(() => {
    // Reiniciar el mock de audio antes de cada prueba
    mockAudioPlay.mockClear();
    sessionStorage.clear(); // Limpiar el sessionStorage antes de cada prueba
  });


  it('debería renderizarse correctamente', () => {
    render(<Temporizador time={time} currentPlayer={currentPlayer} />);
  });
});
