import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import Login from './login';

describe('Login Component', () => {
    beforeEach(() => {
        // Mock del fetch antes de renderizar el componente
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ json: { nickname: 'Ely' } }),
            })
        );

        render(
            <MemoryRouter>
              <Login />
            </MemoryRouter>
        );
    });

    it('Renderiza el componente Login correctamente', () => {
        expect(screen.getByText(/Bienvenido a "El Switcher"/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Nickname/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Iniciar/i })).toBeInTheDocument();
    });

    it('Permite al usuario ingresar un nickname', () => {
        const nicknameInput = screen.getByPlaceholderText(/Nickname/i);
        fireEvent.change(nicknameInput, { target: { value: 'Ely' } });
        expect(nicknameInput.value).toBe('Ely');
    });

    it('Muestra un mensaje de error si se envía un nickname vacío', async () => {
        const button = screen.getByRole('button', { name: /Iniciar/i });
        fireEvent.click(button);
        expect(await screen.findByText(/El campo nickname es requerido./i)).toBeInTheDocument();
    });

    it('Muestra un mensaje de error si el nickname excede el máximo de caracteres', async () => {
        const nicknameInput = screen.getByPlaceholderText(/Nickname/i);
        const button = screen.getByRole('button', { name: /Iniciar/i });

        fireEvent.change(nicknameInput, { target: { value: 'a'.repeat(65) } });
        fireEvent.click(button);
        expect(await screen.findByText(/Solo se permiten 64 caracteres./i)).toBeInTheDocument();
    });

    it('Redirige a la página de Opciones después de iniciar sesión', async () => {
      const nicknameInput = screen.getByPlaceholderText(/Nickname/i);
      const button = screen.getByRole('button', { name: /Iniciar/i });

      fireEvent.change(nicknameInput, { target: { value: 'Ely' } });
      fireEvent.click(button);

      // Verifica que se redirigió a "/Opciones"
      expect(await screen.findByText(/Opciones/i)).toBeInTheDocument();
  });

    it('Envía el JSON correcto al backend', async () => {
        const nicknameInput = screen.getByPlaceholderText(/Nickname/i);
        const button = screen.getByRole('button', { name: /Iniciar/i });

        fireEvent.change(nicknameInput, { target: { value: 'Ely' } });
        fireEvent.click(button);

        // Espera a que se complete la solicitud
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(global.fetch).toHaveBeenCalledWith("https://httpbin.org/post", expect.objectContaining({
            method: "POST",
            body: JSON.stringify({ nickname: 'Ely' }),
        }));
    });
});
