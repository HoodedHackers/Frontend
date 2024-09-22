import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import * as ReactRouter from "react-router";
import Login from "./login";
import { act } from "@testing-library/react";

describe("Login Component", () => {
  let button = null;
  let input = null;
  const navigate = vi.fn();

  beforeEach(() => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    button = screen.getByRole("button", { name: /Iniciar/i });
    input = screen.getByPlaceholderText(/Nickname/i);

    // Mock para useNavigate
    vi.spyOn(ReactRouter, "useNavigate").mockImplementation(() => navigate);

    // Mock global de fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ name: "Ely" }),
      })
    );
  });

  it("Renderiza el componente Login correctamente", () => {
    expect(screen.getByText(/Bienvenido a "El Switcher"/i)).toBeInTheDocument();
  });

  it("Permite al usuario ingresar un nickname", () => {
    fireEvent.change(input, { target: { value: "Ely" } });
    expect(input.value).toBe("Ely");
  });

  it("Muestra un mensaje de error si el nickname excede el máximo de caracteres", async () => {
    fireEvent.change(input, { target: { value: "a".repeat(65) } });
    fireEvent.click(button);
    expect(
      await screen.findByText(/Solo se permiten 64 caracteres./i)
    ).toBeInTheDocument();
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
    await act(async () => {
      fireEvent.change(input, { target: { value: "Ely" } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://httpbin.org/post",
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
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error("Error en la solicitud")));
  
    fireEvent.click(button);
  
    await waitFor(() => {
      // Utiliza una función para verificar que el mensaje de error esté en el documento
      const errorMessageElement = screen.getByText((content, element) => {
        return content.includes("Error en la solicitud");
      });
  
      expect(errorMessageElement).toBeInTheDocument();
    });
  });
});
