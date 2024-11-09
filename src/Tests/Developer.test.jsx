import { render, screen, fireEvent, act } from "@testing-library/react";
import Developer from "../components/Developers/Developer.jsx";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// Datos de ejemplo de los desarrolladores
const developers = [
  { name: "Allasia, Emanuel", img: "/Imagenes/developers/ema.jpeg" },
  { name: "Arias, Eliana", img: "/Imagenes/developers/eli.jpeg" },
  { name: "Gutiérrez, Camilo", img: "/Imagenes/developers/milo.jpeg" },
  { name: "Mamani, Lourdes", img: "/Imagenes/developers/lu.jpeg" },
  { name: "Reyes, Lourdes", img: "/Imagenes/developers/lou.jpeg" },
  { name: "Scantamburlo, Matías", img: "/Imagenes/developers/mati.jpeg" },
  { name: "Villagra, Andrés", img: "/Imagenes/developers/andy.jpeg" },
];

// Mocking useNavigate
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

describe("Componente Developer", () => {
  it("debería renderizar los nombres y las imágenes de los desarrolladores correctamente", () => {
    render(
      <MemoryRouter>
        <Developer />
      </MemoryRouter>
    );

    // Verificar que cada nombre y su imagen correspondiente se muestren
    developers.forEach((developer) => {
      expect(screen.getByText(developer.name)).toBeInTheDocument();
      const img = screen.getByAltText(developer.name);
      expect(img).toHaveAttribute("src", developer.img);
    });
  });

  it("debería cambiar al siguiente desarrollador cuando se haga clic en el botón 'next'", () => {
    render(
      <MemoryRouter>
        <Developer />
      </MemoryRouter>
    );

    const nextButton = screen.getByText("▶");
    const initialDeveloperName = developers[0].name;

    // Verificar que el primer desarrollador se muestra inicialmente
    expect(screen.getByText(initialDeveloperName)).toBeInTheDocument();

    // Hacer clic en el botón "next"
    fireEvent.click(nextButton);

    // Esperar al siguiente renderizado y verificar que el siguiente desarrollador se muestra
    const nextDeveloperName = developers[1].name;
    expect(screen.getByText(nextDeveloperName)).toBeInTheDocument();
  });

  it("debería cambiar al desarrollador anterior cuando se haga clic en el botón 'prev'", () => {
    render(
      <MemoryRouter>
        <Developer />
      </MemoryRouter>
    );

    const prevButton = screen.getByText("◀");
    const initialDeveloperName = developers[0].name;

    // Hacer clic en el botón "prev"
    fireEvent.click(prevButton);

    // Esperar al último desarrollador (por ser circular) y verificar que se muestre correctamente
    const lastDeveloperName = developers[developers.length - 1].name;
    expect(screen.getByText(lastDeveloperName)).toBeInTheDocument();
  });

  it("debería reproducir el audio al renderizar el componente", async () => {
    render(
      <MemoryRouter>
        <Developer />
      </MemoryRouter>
    );

    const audioElement = screen.getByRole("audio");
    
    // Verificar que el audio se está reproduciendo
    await act(async () => {
      expect(audioElement).toHaveAttribute('loop');
      expect(audioElement.paused).toBe(false);
    });
  });

  it("debería redirigir al lobby al hacer clic en el botón 'Volver al Lobby'", () => {
    const mockNavigate = vi.fn();
    vi.mock("react-router-dom", () => ({
      useNavigate: () => mockNavigate,
    }));

    render(
      <MemoryRouter>
        <Developer />
      </MemoryRouter>
    );

    const backToLobbyButton = screen.getByText("Volver al Lobby");

    // Hacer clic en el botón "Volver al Lobby"
    fireEvent.click(backToLobbyButton);

    // Verificar que la función navigate se haya llamado con la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
