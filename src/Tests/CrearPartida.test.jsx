import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import * as ReactRouter from "react-router";
import CrearPartida from "../components/Opciones/CrearPartida/CrearPartida.jsx";
import { WebSocketContext } from "../components/WebSocketsProvider.jsx";

describe("CrearPartida Component", () => {
  let button = null;
  const navigate = vi.fn();

  beforeEach(() => {
    // Mock para useNavigate
    vi.spyOn(ReactRouter, "useNavigate").mockImplementation(() => navigate);

    // Mock de sessionStorage para identifier
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "identifier") {
        return "1234";
      }
      return null;
    });

    // Mock global de fetch
    global.fetch = vi.fn((url, options) => {
      if (url === "http://127.0.0.1:8000/api/lobby" && options.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: "12345" }),
        });
      } else {
        return Promise.reject(new Error("URL no mockeada"));
      }
    });

    // Mock del contexto WebSocket
    const wsUPRefMock = { current: null };
    render(
      <WebSocketContext.Provider value={{ wsUPRef: wsUPRefMock }}>
        <BrowserRouter>
          <CrearPartida />
        </BrowserRouter>
      </WebSocketContext.Provider>
    );

    button = screen.getByRole("button", { name: /Crear Partida/i });
  });

  afterEach(() => {
    vi.clearAllMocks(); // Limpiar mocks
  });

  it("Renderiza el componente CrearPartida correctamente", () => {
    expect(screen.getByRole("heading", { name: /crear partida/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /crear partida/i })).toBeInTheDocument();
  });

  it("Permite al usuario ingresar el nombre de la partida", () => {
    const inputNombre = screen.getByLabelText(/Nombre de Partida/i);
    fireEvent.change(inputNombre, { target: { value: "Mi Partida" } });
    expect(inputNombre.value).toBe("Mi Partida");
  });

  it("Permite al usuario ingresar el número mínimo de jugadores", () => {
    const inputMinJugadores = screen.getByLabelText(/Min Jugadores/i);
    fireEvent.change(inputMinJugadores, { target: { value: "2" } });
    expect(inputMinJugadores.value).toBe("2");
  });

  it("Permite al usuario ingresar el número máximo de jugadores", () => {
    const inputMaxJugadores = screen.getByLabelText(/Max Jugadores/i);
    fireEvent.change(inputMaxJugadores, { target: { value: "4" } });
    expect(inputMaxJugadores.value).toBe("4");
  });

  it("Redirige a la pantalla de espera después de crear la partida", async () => {
    fireEvent.change(screen.getByLabelText(/Nombre de Partida/i), { target: { value: "Mi Partida" } });
    fireEvent.change(screen.getByLabelText(/Min Jugadores/i), { target: { value: "2" } });
    fireEvent.change(screen.getByLabelText(/Max Jugadores/i), { target: { value: "4" } });

    fireEvent.click(button);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled()); // Asegurar que fetch se haya llamado

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/Partida/12345"); // Comprobar redirección
    }, { timeout: 2000 });
  });

  it("Envía el JSON correcto al backend", async () => {
    fireEvent.change(screen.getByLabelText(/Nombre de Partida/i), { target: { value: "Mi Partida" } });
    fireEvent.change(screen.getByLabelText(/Min Jugadores/i), { target: { value: "2" } });
    fireEvent.change(screen.getByLabelText(/Max Jugadores/i), { target: { value: "4" } });
    fireEvent.change(screen.getByLabelText(/Tipo de Partida/i), { target: { value: "privada" } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "123456" } });

    fireEvent.click(button);

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/api/lobby",
            expect.objectContaining({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "Mi Partida",
                    min_players: "2",
                    max_players: "4",
                    identifier: "1234",
                    is_private: true,
                    password: "123456",
                }),
            })
        );
    });
});

  it("Muestra y oculta correctamente el campo de contraseña para partidas privadas", () => {
    const tipoSelect = screen.getByLabelText(/Tipo de Partida/i);

    fireEvent.change(tipoSelect, { target: { value: "privada" } });
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();

    fireEvent.change(tipoSelect, { target: { value: "publica" } });
    expect(screen.queryByLabelText(/Contraseña/i)).not.toBeInTheDocument();
  });

  it("Muestra un mensaje de error si la solicitud al backend falla", async () => {
    // Simula una respuesta fallida
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: "Error al crear la partida" }),
      })
    );

    fireEvent.click(button);
  });

  it("Muestra un mensaje de error si el nombre de la partida está vacío", () => {
    fireEvent.click(button);
    expect(screen.getByText("El nombre de la partida es obligatorio.")).toBeInTheDocument();
  });

  it("Muestra un mensaje de error si el nombre de la partida excede los 64 caracteres", () => {
    fireEvent.change(screen.getByLabelText(/Nombre de Partida/i), {
      target: { value: "a".repeat(65) },
    });
    fireEvent.click(button);
    expect(screen.getByText("El nombre de la partida es no puede exceder de los 64 caracteres.")).toBeInTheDocument();
  });
});
