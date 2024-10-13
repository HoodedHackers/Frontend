import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import AbandonarPartida from '../components/Partida/AbandonarPartida/AbandonarPartida.jsx';
import { useNavigate } from 'react-router-dom';

// Mockear el useNavigate para verificar si se llama correctamente
const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe('AbandonarPartida', () => {
    afterEach(() => {
        // Limpiar mocks después de cada test
        vi.clearAllMocks();
    });

    it('Renderiza correctamente el botón de abandonar partida', () => {
        render(<AbandonarPartida />);
        const abandonarButton = screen.getByText(/Abandonar Partida/i);
        expect(abandonarButton).toBeInTheDocument();  // Comprueba que el botón se renderiza
    });

    it('Redirige a /Opciones cuando la respuesta es exitosa', async () => {
        // Mockear fetch para devolver una respuesta exitosa
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        players: [{ name: 'Player 1' }],
                    }),
            })
        );

        render(<AbandonarPartida />);
        const abandonarButton = screen.getByText(/Abandonar Partida/i);
        fireEvent.click(abandonarButton);

        // Espera a que se complete la operación y se verifique que se ha redirigido
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/Opciones');  // Verifica que se navega a '/Opciones'
        });

        global.fetch.mockClear();
    });

    it('Muestra un error cuando el lobby no es encontrado', async () => {
        // Mockear fetch para devolver un 404
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                status: 404,
            })
        );

        render(<AbandonarPartida />);
        const abandonarButton = screen.getByText(/Abandonar Partida/i);
        fireEvent.click(abandonarButton);

        await waitFor(() => {
            expect(screen.getByText(/Lobby no encontrado/i)).toBeInTheDocument();
        });

        global.fetch.mockClear();
    });

    it('Muestra un error cuando no se puede abandonar la partida', async () => {
        // Mockear fetch para devolver un 412
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                status: 412,
            })
        );

        render(<AbandonarPartida />);
        const abandonarButton = screen.getByText(/Abandonar Partida/i);
        fireEvent.click(abandonarButton);

        await waitFor(() => {
            expect(screen.getByText(/No puedes abandonar, el juego ya ha comenzado/i)).toBeInTheDocument();
        });

        global.fetch.mockClear();
    });

    it('Muestra un error cuando ocurre un error inesperado', async () => {
        // Mockear fetch para devolver un error inesperado
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
            })
        );

        render(<AbandonarPartida />);
        const abandonarButton = screen.getByText(/Abandonar Partida/i);
        fireEvent.click(abandonarButton);

        await waitFor(() => {
            expect(screen.getByText(/Ocurrió un error inesperado/i)).toBeInTheDocument();
        });

        global.fetch.mockClear();
    });

    it('Muestra un mensaje de error de conexión al servidor', async () => {
        // Mockear fetch para lanzar un error
        global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));

        render(<AbandonarPartida />);
        const abandonarButton = screen.getByText(/Abandonar Partida/i);
        fireEvent.click(abandonarButton);

        await waitFor(() => {
            expect(screen.getByText(/Error de conexión con el servidor/i)).toBeInTheDocument();
        });

        global.fetch.mockClear();
    });
});