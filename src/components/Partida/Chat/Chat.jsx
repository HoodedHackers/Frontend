import { useState, useEffect, useContext } from 'react';
import { WebSocketContext } from '../../WebSocketsProvider.jsx';
import './Chat.css';

function Chat() {
  
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const { wsCRef } = useContext(WebSocketContext);
  const game_id = sessionStorage.getItem('partida_id');
  const userName = sessionStorage.getItem('player_nickname');

  useEffect(() => {
    if (wsCRef.current && wsCRef.current.readyState !== WebSocket.CLOSED) {
      return;
    }

    try {
      wsCRef.current = new WebSocket(
        `ws://127.0.0.1:8000/ws/lobby/${game_id}/chat`,
      );
      wsCRef.current.onopen = () => {
        console.log("Conexión con el WebSocket del Chat abierta");
      };
      wsCRef.current.onmessage = (event) => {
        const mensaje = JSON.parse(event.data);
        setMensajes(mensajes => [
          { usuario: mensaje.usuario, mensaje: mensaje.mensaje },
          ...mensajes,
        ]);
      };
      wsCRef.current.onerror = (error) => {
        console.error("Error en el WebSocket del Chat: ", error);
      };
    } catch (error) {
      console.error(error);
      if (wsCRef.current) {
        wsCRef.current.close();
        wsCRef.current = null;
        console.log("WebSocket del Chat cerrado");
      }
    }
  }, [wsCRef.current]);

  const enviarMensaje = () => {
    if (nuevoMensaje.trim() !== '') {
      const mensaje = JSON.stringify({
        usuario: userName,
        mensaje: nuevoMensaje,
      });
      wsCRef.current.send(mensaje);
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
