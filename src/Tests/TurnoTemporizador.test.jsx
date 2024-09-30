import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import TurnoTemporizador from "../components/Temporizador/TurnoTemporizador";
import * as React from "react";

// Simular localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("TurnoTemporizador Component", () => {
  const tiempoLimite = 30; // tiempo límite en segundos
  const jugadorActual = "Jugador1";
  const onFinTurno = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers(); // Mock de temporizadores
    render(<TurnoTemporizador tiempoLimite={tiempoLimite} jugadorActual={jugadorActual} onFinTurno={onFinTurno} />);
  });

  afterEach(() => {
    vi.clearAllMocks(); // Limpiar mocks
    vi.useRealTimers(); // Restaurar temporizadores reales
    localStorage.clear(); // Limpiar localStorage
  });

  it("Renderiza el componente TurnoTemporizador correctamente", () => {
    // Verifica que el jugador actual se muestra correctamente
    expect(screen.getByText(/Turno:/i)).toBeInTheDocument();
    expect(screen.getByText(/Jugador1/i)).toBeInTheDocument();

    // Verifica que el temporizador se muestra correctamente
    expect(screen.getByText(/00:30/i)).toBeInTheDocument();
  });

  it("Disminuye el temporizador correctamente", () => {
    // Avanzar 5 segundos en el temporizador
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Verifica que el temporizador ahora muestre 00:25
    expect(screen.getByText(/00:25/i)).toBeInTheDocument();
  });

});
