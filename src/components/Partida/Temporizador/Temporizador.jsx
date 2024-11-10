import "./Temporizador.css"; // Importa tu archivo CSS normal

const Temporizador = ({ time, currentPlayer }) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  // Cambiar color del texto dependiendo del tiempo
  const getColor = () => {
    if (time >= 119) return "#ff0000"; // Rojo cuando el tiempo es 0
    if (time >= 110) return "#ff7f00"; // Naranja para los últimos 10 segundos
    return "#ffffff"; // Blanco por defecto
  };

  const timerClass = time >= 110 ? "timer-warning-active" : "";

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
    </div>
  );
};

export default Temporizador;
