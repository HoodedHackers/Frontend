  import { useState, useEffect, useContext } from 'react';
  import { WebSocketContext } from '../../WebSocketsProvider.jsx';
  import './Chat.css';
  
  function Chat() {
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [mensajes, setMensajes] = useState([]);
    const { wsCRef } = useContext(WebSocketContext);
    const game_id = sessionStorage.getItem('partida_id');
    const player_id = sessionStorage.getItem('player_id'); // Asumiendo que tienes el player_id en sessionStorage
  
    // Configurar WebSocket y escuchar mensajes
    useEffect(() => {
      if (wsCRef.current && wsCRef.current.readyState !== WebSocket.CLOSED) {
        return;
      }
  
      // Establecer conexión WebSocket
      try {
        wsCRef.current = new WebSocket(
          `ws://127.0.0.1:8000/ws/lobby/${game_id}/chat?player_id=${player_id}`
        );
  
        wsCRef.current.onopen = () => {
          console.log("Conexión con el WebSocket del Chat abierta");
        };
  
        wsCRef.current.onmessage = (event) => {
          const mensaje = JSON.parse(event.data);
          if (mensaje.message) {
            setMensajes(prevMensajes => [
              { usuario: mensaje.name, mensaje: mensaje.message },
              ...prevMensajes,
            ]);
          }
        };
  
        wsCRef.current.onerror = (error) => {
          console.error("Error en el WebSocket del Chat: ", error);
        };
  
        wsCRef.current.onclose = () => {
          console.log("Conexión WebSocket cerrada");
        };
      } catch (error) {
        console.error("Error al crear WebSocket: ", error);
        if (wsCRef.current) {
          wsCRef.current.close();
        }
      }
    }, [wsCRef.current, game_id, player_id]);
  
    // Enviar mensaje al WebSocket
    const enviarMensaje = () => {
      if (nuevoMensaje.trim() !== '') {
        const mensaje = JSON.stringify({
          message: nuevoMensaje, // Enviar solo el mensaje
        });
        wsCRef.current.send(mensaje);
        setNuevoMensaje('');
      }
    };
  
    // Manejar tecla "Enter" para enviar el mensaje
    const manejarTecla = (e) => {
      if (e.key === 'Enter') {
        enviarMensaje();
      }
    };
  
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
  