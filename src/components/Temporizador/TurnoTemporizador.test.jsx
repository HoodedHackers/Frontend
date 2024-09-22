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

  it("Muestra el turno del jugador actual", () => {
    const turnoText = screen.getByText(/Turno de Ely/i);
    expect(turnoText).toBeInTheDocument();
  }); 
});

  
/*
  it("Finaliza el turno cuando el tiempo se agota", async () => {
    vi.advanceTimersByTime(120000); // Avanza el tiempo a 0
    const finalizadoText = await screen.findByText(/¡Tu turno finalizó!/i);
    expect(finalizadoText).toBeInTheDocument();
  });




  it("Reinicia el temporizador después de finalizar el turno", async () => {
  // Avanza el tiempo para finalizar el turno
  vi.advanceTimersByTime(120000); // 2 minutos
  await screen.findByText(/¡Tu turno finalizó!/i); // Espera a que aparezca la notificación
  
  // Avanza el tiempo para el reinicio
  vi.advanceTimersByTime(2000); // 2 segundos
  
  // Verifica que el temporizador se reinicie
  await waitFor(() => {
    expect(screen.getByText(/02:00/i)).toBeInTheDocument();
  });
  

  it("Reproduce el audio cuando el tiempo se agota", async () => {
    const playAudioSpy = vi.spyOn(window.HTMLAudioElement.prototype, "play").mockImplementation(() => {});

    vi.advanceTimersByTime(120000); // Avanza el tiempo a 0

    await waitFor(() => {
      expect(playAudioSpy).toHaveBeenCalled();
    });
  });

  it("Reinicia el temporizador después de finalizar el turno", async () => {
    vi.advanceTimersByTime(120000); // Finaliza el turno
    await screen.findByText(/¡Tu turno finalizó!/i); // Espera a que aparezca la notificación
    vi.advanceTimersByTime(2000); // Espera el tiempo de reinicio
    const resetText = await screen.findByText(/02:00/i); // Verifica que el temporizador se reinicie
    expect(resetText).toBeInTheDocument();
  });

  it("No inicia el temporizador si hay menos de 2 jugadores", () => {
    jugadoresEnPartida = 1; // Menos de 2 jugadores
    render(
      <TurnoTemporizador tiempoLimite={tiempoLimite} jugadorActual={jugadorActual} jugadoresEnPartida={jugadoresEnPartida} />
    );

    const timerText = screen.queryByText(/02:00/i);
    expect(timerText).not.toBeInTheDocument(); // Verifica que el temporizador no se muestre
  });*/

