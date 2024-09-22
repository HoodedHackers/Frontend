import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Opciones from "./Opciones";
import * as ReactRouter from "react-router";

describe("Opciones Component", () => {
  const navigate = vi.fn();

  beforeEach(() => {
    // Mock para useNavigate
    vi.spyOn(ReactRouter, "useNavigate").mockImplementation(() => navigate);

    // Configuramos un nickname en el localStorage
    localStorage.setItem("nickname", "Ely");
  });

  afterEach(() => {
    localStorage.clear(); // Limpiar el localStorage después de cada prueba
    vi.clearAllMocks(); // Limpiar mocks
  });

  it("Renderiza el componente Opciones correctamente", () => {
    render(
      <BrowserRouter>
        <Opciones />
      </BrowserRouter>
    );

    expect(screen.getByText(/Bienvenid@, Ely!/i)).toBeInTheDocument();
    expect(screen.getByText(/Elegí una opción/i)).toBeInTheDocument();
  });

  it("Navega a Partida al hacer clic en el botón 'Crear Partida'", () => {
    render(
      <BrowserRouter>
        <Opciones />
      </BrowserRouter>
    );

    const crearPartidaButton = screen.getByRole("button", { name: /Crear Partida/i });
    fireEvent.click(crearPartidaButton);

    expect(navigate).toHaveBeenCalledWith("/Partida"); // Cambiado a /Partida
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it("Navega a Partida al hacer clic en el botón 'Unirse a Partida'", () => {
    render(
      <BrowserRouter>
        <Opciones />
      </BrowserRouter>
    );

    const unirsePartidaButton = screen.getByRole("button", { name: /Unirse a Partida/i });
    fireEvent.click(unirsePartidaButton);

    expect(navigate).toHaveBeenCalledWith("/Partida"); // Cambiado a /Partida
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it("Muestra el mensaje correcto si el nickname está vacío", () => {
    localStorage.setItem("nickname", ""); // Establecemos un nickname vacío
    render(
      <BrowserRouter>
        <Opciones />
      </BrowserRouter>
    );

    expect(screen.getByText(/Bienvenid@, !/i)).toBeInTheDocument(); // Esperamos que el nickname esté vacío
  });

  it("Muestra el mensaje correcto si no hay nickname en localStorage", () => {
    localStorage.removeItem("nickname"); // Eliminamos el nickname
    render(
      <BrowserRouter>
        <Opciones />
      </BrowserRouter>
    );

    expect(screen.getByText(/Bienvenid@, !/i)).toBeInTheDocument(); // Verificamos que se maneje correctamente la ausencia del nickname
  });
});
