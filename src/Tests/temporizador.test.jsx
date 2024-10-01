import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TurnoTemporizador from "../components/Partida/temporizador/temporizador.jsx";

// Mocks de localStorage y audio
beforeEach(() => {
  // Mock de localStorage
  vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
    if (key === "timeLeft") return null; // Simulamos que no hay tiempo guardado
    return null;
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});

  const mockAudioPlay = vi.fn();
  const mockAudioAddEventListener = vi.fn();
  vi.spyOn(global, "Audio").mockImplementation(() => ({
    play: mockAudioPlay,
    addEventListener: mockAudioAddEventListener,
  }));

  global.mockAudioPlay = mockAudioPlay;
  global.mockAudioAddEventListener = mockAudioAddEventListener;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("TurnoTemporizador", () => {
  it("debe renderizar correctamente con tiempo inicial", () => {
    render(<TurnoTemporizador tiempoLimite={120} />); // 2 minutos
    const timer = screen.getByText("02:00"); // Verificamos que el tiempo inicial se muestre
    expect(timer).toBeInTheDocument();
  });

  it("debe decrementar el tiempo cada segundo", () => {
    vi.useFakeTimers(); // Habilitamos el uso de timers falsos
    render(<TurnoTemporizador tiempoLimite={60} />); // 1 minuto

    act(() => {
      vi.advanceTimersByTime(1000); // Avanza 1 segundo
    });

    expect(screen.getByText("00:59")).toBeInTheDocument(); // Después de 1 segundo, el temporizador debe mostrar 00:59
  });

  it("debe almacenar el tiempo restante en localStorage antes de recargar", () => {
    render(<TurnoTemporizador tiempoLimite={120} />);

    // Simulamos una cuenta regresiva
    act(() => {
      vi.advanceTimersByTime(5000); // Avanza 5 segundos
    });

    // Simulamos el evento beforeunload
    const event = new Event("beforeunload");
    window.dispatchEvent(event);

    // Verificamos que localStorage se actualizó correctamente
    expect(localStorage.setItem).toHaveBeenCalledWith("timeLeft", 115);
  });
});