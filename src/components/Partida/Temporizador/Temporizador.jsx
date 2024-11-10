import React, { useEffect, useState } from "react";
import "./Temporizador.css"; 

const Temporizador = ({ time, currentPlayer }) => {
  const [colorBloqueado, setColorBloqueado] = useState("#ffffff"); // Color inicial por defecto
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  // Cambiar color del texto dependiendo del tiempo
  const getColor = () => {
    if (time >= 119) return "#ff0000"; 
    if (time >= 110) return "#ff7f00"; 
    return "#ffffff"; 
  };

  const timerClass = time >= 110 ? "timer-warning-active" : "";

  useEffect(() => {
    // Conectar al WebSocket cuando el componente se monta
    const ws = new WebSocket("wss://tu-servidor.com/partida/color-bloqueado"); // URL de tu WebSocket

    // Recibir mensaje del WebSocket y actualizar color bloqueado
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.colorBloqueado) {
        setColorBloqueado(data.colorBloqueado);
      }
    };

    // Cerrar la conexión WebSocket al desmontar el componente
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="rectangulo">
      <span className={`timer-text ${timerClass}`} style={{ color: getColor() }}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
      <div className="turnIndicator">
        <p>
          Turno: <strong>{currentPlayer}</strong>
        </p>
      </div>
      {/* Rectángulo para el color bloqueado */}
      <div
        className="color-bloqueado"
        style={{
          backgroundColor: colorBloqueado,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px', 
          height: '40px',
          marginTop: '10px',
          width: '80px',
        }}
      >
        <span style={{ fontSize: '25px' }}>🔒</span>
      </div>
    </div>
  );
};

export default Temporizador;
