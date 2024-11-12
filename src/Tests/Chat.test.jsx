import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Chat from '../components/Partida/Chat/Chat.jsx';
import { WebSocketContext } from '../components/WebSocketsProvider.jsx';

// Mock del WebSocketContext
const mockWsContext = {
    wsCRef: { current: null }
  };

describe('Chat Component', () => {

  it('Renderiza un mensaje correctamente', () => {
        // Renderizar el componente
        render(
            <WebSocketContext.Provider value={mockWsContext}>
                <Chat />
            </WebSocketContext.Provider>
        );

        // Mockear un mensaje inicial
        const mockMensaje = { usuario: 'TestUser', mensaje: 'Hola Mundo' };
        const setMensajes = vi.fn().mockReturnValue([mockMensaje]);
    
        // Simular el estado con un mensaje
        render(<Chat setMensajes={setMensajes} />);
        
        // Verificar que el mensaje aparezca en el DOM
        expect(screen.getByText(/Hola Mundo/i)).toBeInTheDocument();
        expect(screen.getByText(/TestUser/i)).toBeInTheDocument();
  });

  it('Renderiza correcatemente mensajes de varios jugadores', () => {

  });

});

