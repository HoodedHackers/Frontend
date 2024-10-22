import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import AbandonarPartida from '../components/Partida/AbandonarPartida/AbandonarPartida.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { WebSocketContext } from '../components/WebSocketsProvider';

// Mockeamos 'useNavigate', pero mantenemos el resto de 'react-router-dom' sin cambios
vi.mock('react-router-dom', async () => {
    const originalModule = await vi.importActual('react-router-dom');
    return {
        ...originalModule,
        useNavigate: () => vi.fn(),
    };
});

// Mockeamos 'fetch' para evitar realizar solicitudes reales al backend
global.fetch = vi.fn();

describe('AbandonarPartida Component', () => {
    const mockWebSocket = { current: { close: vi.fn() } };
    const mockNavigate = vi.fn();
    
    beforeEach(() => {
        // Mockeamos sessionStorage
        sessionStorage.setItem('identifier', 'testIdentifier');
        sessionStorage.setItem('partida_id', '1234');
        sessionStorage.setItem('isOwner', 'false');
        sessionStorage.setItem('player_nickname', 'testPlayer');
        sessionStorage.setItem('players', JSON.stringify([{ player_name: 'testPlayer' }, { player_name: 'player2' }]));
        
        // Restauramos el mock de fetch antes de cada test
        global.fetch.mockReset();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    // Test 1: Verificar que el botón "Abandonar Partida" se renderiza correctamente
    it('debería renderizar el botón Abandonar Partida', () => {
        render(
            <Router>
                <WebSocketContext.Provider value={{ wsUPRef: mockWebSocket }}>
                    <AbandonarPartida />
                </WebSocketContext.Provider>
            </Router>
        );

        const button = screen.getByRole('button', { name: /Abandonar Partida/i });
        expect(button).toBeInTheDocument();
    });

    // Test 2: Verificar el estado de carga cuando se presiona el botón
    it('debería mostrar "Saliendo..." cuando se hace clic en Abandonar Partida', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ status: 'success' }),
        });
        
        render(
            <Router>
                <WebSocketContext.Provider value={{ wsUPRef: mockWebSocket }}>
                    <AbandonarPartida />
                </WebSocketContext.Provider>
            </Router>
        );

        const button = screen.getByRole('button', { name: /Abandonar Partida/i });
        fireEvent.click(button);

        expect(button).toBeDisabled();
        expect(button).toHaveTextContent('Saliendo...');

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
            expect(button).not.toBeDisabled();
            expect(button).toHaveTextContent('Abandonar Partida');
        });
    });

    // Test 3: Verificar error de conexión al servidor
    it('debería mostrar error de conexión al servidor', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Error de conexión'));

        render(
            <Router>
                <WebSocketContext.Provider value={{ wsUPRef: mockWebSocket }}>
                    <AbandonarPartida />
                </WebSocketContext.Provider>
            </Router>
        );

        const button = screen.getByRole('button', { name: /Abandonar Partida/i });
        fireEvent.click(button);

        await waitFor(() => {
            const errorMessage = screen.getByText(/Error de conexión con el servidor/i);
            expect(errorMessage).toBeInTheDocument();
        });
    });

    // Test 4: Verificar la conexión exitosa con el backend
    it('debería conectarse correctamente con el backend y manejar la respuesta exitosa', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ status: 'success' }),
        });

        render(
            <Router>
                <WebSocketContext.Provider value={{ wsUPRef: mockWebSocket }}>
                    <AbandonarPartida />
                </WebSocketContext.Provider>
            </Router>
        );

        const button = screen.getByRole('button', { name: /Abandonar Partida/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/api/lobby/1234/exit',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ identifier: 'testIdentifier' }),
                })
            );
        });
    });
});
