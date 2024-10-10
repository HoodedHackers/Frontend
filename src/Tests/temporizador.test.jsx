import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Temporizador from "../components/Partida/Temporizador/Temporizador.jsx";

describe("Temporizador", () => {
  const tiempoLimite = 120; // 2 minutos
  const jugadorActual = "Ely";
  let jugadoresEnPartida = 2; // Mínimo requerido para iniciar el Temporizador

  beforeEach(() => {
    vi.useFakeTimers(); // Utiliza temporizadores simulados
    render(
      <Temporizador tiempoLimite={tiempoLimite} jugadorActual={jugadorActual} jugadoresEnPartida={jugadoresEnPartida} />
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

  