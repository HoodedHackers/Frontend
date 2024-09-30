import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BotonPasarTurno from "../components/PasarTurno/PasarTurno"; // Cambiado aquí

describe("Componente BotonPasarTurno", () => {
  let jugadores;
  let jugadorActual;
  let onTurnoCambiadoMock;
  let setTimeLeftMock;
  let tiempoLimite;

  beforeEach(() => {
    jugadores = ["Jugador 1", "Jugador 2", "Jugador 3"];
    jugadorActual = "Jugador 1";
    onTurnoCambiadoMock = vi.fn();
    setTimeLeftMock = vi.fn();
    tiempoLimite = 120; // 2 minutos

    // Mock de la función fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
  });

  it("debería renderizar el botón y habilitarlo para el jugador actual", () => {
    render(
      <BotonPasarTurno
        jugadorActual={jugadorActual}
        jugadores={jugadores}
        onTurnoCambiado={onTurnoCambiadoMock}
        tiempoLimite={tiempoLimite}
        setTimeLeft={setTimeLeftMock}
      />
    );

    const button = screen.getByText(/Terminar Turno/i);
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled(); // Habilitado para el jugador actual
  });

  it("debería poder cambiar el turno y enviar datos con fetch al pasar el turno", async () => {
    render(
      <BotonPasarTurno
        jugadorActual={jugadorActual}
        jugadores={jugadores}
        onTurnoCambiado={onTurnoCambiadoMock}
        tiempoLimite={tiempoLimite}
        setTimeLeft={setTimeLeftMock}
      />
    );

    const button = screen.getByText(/Terminar Turno/i);
    fireEvent.click(button);

    // Esperar a que se complete la llamada fetch
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Verificar que fetch fue llamado con los datos correctos
    expect(global.fetch).toHaveBeenCalledWith(
      "https://httpbin.org/post",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jugadorActualIndex: 1 }),
      })
    );

    // Verificar que se actualiza el turno correctamente
    expect(onTurnoCambiadoMock).toHaveBeenCalled();

    // Verificar que se reinicia el temporizador
    expect(setTimeLeftMock).toHaveBeenCalledWith(tiempoLimite);
  });

});
