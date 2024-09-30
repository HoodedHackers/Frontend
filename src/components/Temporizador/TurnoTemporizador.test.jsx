import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import TurnoTemporizador from "./TurnoTemporizador";

describe("TurnoTemporizador Component", () => {
  const tiempoLimite = 120; // 2 minutos
  const jugadorActual = "Ely";
  let jugadoresEnPartida = 2; // Mínimo requerido para iniciar el temporizador

  beforeEach(() => {
    vi.useFakeTimers(); // Utiliza temporizadores simulados
    render(
      <TurnoTemporizador tiempoLimite={tiempoLimite} jugadorActual={jugadorActual} jugadoresEnPartida={jugadoresEnPartida} />
    );
  });

  afterEach(() => {
    vi.clearAllMocks(); // Limpiar mocks
    vi.useRealTimers(); // Regresar a temporizadores reales
  });

  it("Renderiza el temporizador correctamente al inicio del turno", () => {
    const timerText = screen.getByText(/02:00/i);
    expect(timerText).toBeInTheDocument();
  });


});

  