import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import * as ReactRouter from "react-router";
import Login from "../components/Login/Login";

describe("Login Component", () => {
  let button = null;
  let input = null;
  const navigate = vi.fn();

  beforeEach(() => {
    // Mock para useNavigate
    vi.spyOn(ReactRouter, "useNavigate").mockImplementation(() => navigate);

    // Mock global de fetch con cualquier URL
    global.fetch = vi.fn((url, options) => {
      if (url === "http://127.0.0.1:8000/api/name") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ identifier: "12345" }),
        });
      } else {
        return Promise.reject(new Error("URL no mockeada"));
      }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    button = screen.getByRole("button", { name: /Iniciar/i });
    input = screen.getByPlaceholderText(/Nickname/i);
  });

  afterEach(() => {
    vi.clearAllMocks(); // Limpiar mocks
    sessionStorage.clear(); // Limpiar sessionStorage
  });

  it("Renderiza el componente Login correctamente", () => {
    expect(screen.getByText(/¡Bienvenido a "El Switcher"!/i)).toBeInTheDocument();
  });

  it("Permite al usuario ingresar un nickname", () => {
    fireEvent.change(input, { target: { value: "Ely" } });
    expect(input.value).toBe("Ely");
  });

  it("Muestra un mensaje de error si el nickname excede el máximo de caracteres", async () => {
    fireEvent.change(input, { target: { value: "a".repeat(65) } });
    fireEvent.click(button);
    expect(await screen.findByText(/Solo se permiten 64 caracteres./i)).toBeInTheDocument();
  });

  it("Redirige a la página de Opciones después de iniciar sesión", async () => {
    fireEvent.change(input, { target: { value: "Ely" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/Opciones");
      expect(navigate).toHaveBeenCalledTimes(1);
    });
  });

  it("Envía el JSON correcto al backend", async () => {
    fireEvent.change(input, { target: { value: "Ely" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/api/name",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ name: "Ely" }),
        })
      );
    });
  });

  it("Muestra un mensaje de error si la solicitud al backend falla", async () => {
    fireEvent.change(input, { target: { value: "Ely" } });

    // Simula una respuesta fallida
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: "Error en la solicitud" }),
      })
    );

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Error en la solicitud/i)).toBeInTheDocument();
    });
  });

  it("Muestra un mensaje de error si no se ingreso un nickname", async () => {
    fireEvent.change(input, { target: { value: "" } }); // Nombre vacío
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/El campo no puede estar vacío./i)).toBeInTheDocument();
    });
  });
});