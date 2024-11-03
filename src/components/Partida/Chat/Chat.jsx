import { useState, useEffect, useContext } from 'react';
import { PartidaContext } from '../PartidaProvider.jsx';
import { WebSocketContext } from '../../WebSocketsProvider.jsx';
import './Chat.css';

function Chat() {

  const [isConnected, setIsConnected] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const { setIsChatOpen } = useContext(PartidaContext);
  const { wsCRef } = useContext(WebSocketContext);
  const game_id = sessionStorage.getItem('partida_id');
  const userName = sessionStorage.getItem('player_nickname');

  // useEffect(() => {
  //   if (wsCRef.current && wsCRef.current.readyState !== WebSocket.CLOSED) {
  //     return;
  //   }
// 
  //   try {
  //     wsCRef.current = new WebSocket(
  //       `ws://127.0.0.1:8000//ws/game/${game_id}/chat`,
  //     );
  //     wsCRef.current.onopen = () => {
  //       console.log("Conexión con el WebSocket del Chat abierta");
  //     };
  //     wsCRef.current.onmessage = (event) => {
  //     };
  //     wsCRef.current.onerror = (error) => {
  //       console.error("Error en el WebSocket del Chat: ", error);
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     if (wsCRef.current) {
  //       wsCRef.current.close();
  //       wsCRef.current = null;
  //       console.log("WebSocket del Chat cerrado");
  //     }
  //   }
  // }, [wsCRef.current]);

  const enviarMensaje = () => {
    if (nuevoMensaje.trim() !== '') {
      setMensajes(mensajes => [
        { usuario: `${userName}`, mensaje: nuevoMensaje },
        ...mensajes,
      ]);
    
      setNuevoMensaje('');
    }
  }

  const manejarTecla = (e) => {
    if (e.key === 'Enter') {
      enviarMensaje();
    }
  }

  return (
    <div>
      <div className="chat-header">
        <button className="close-button" onClick={() => setIsChatOpen(false)}>X</button>
      </div>
      <ul className="ul-chat">
        {mensajes.map((mensaje, index) => (
          <li key={index} className="li-message">
            <div><b>{mensaje.usuario}</b></div>
            <div>{mensaje.mensaje}</div>
          </li>
        ))}
      </ul>
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={nuevoMensaje}
          onChange={e => setNuevoMensaje(e.target.value)}
          onKeyDown={manejarTecla}
        />
        <button className="send-button" onClick={enviarMensaje}>Enviar</button>
      </div>
    </div>
  );
}

export default Chat;
