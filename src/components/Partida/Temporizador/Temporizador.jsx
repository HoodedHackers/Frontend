import "./Temporizador.css"; // Importa tu archivo CSS normal

const Temporizador = ({ time, currentPlayer, colorBloqueado }) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const getColor = () => {
    if (time >= 119) return "#ff0000"; // Rojo cuando el tiempo es 0
    if (time >= 110) return "#ff7f00"; // Naranja para los últimos 10 segundos
    return "#ffffff"; // Blanco por defecto
  };

  const timerClass = time >= 110 ? "timer-warning-active" : "";

  return (
    <div className="rectangulo">
      <span
        className={`timer-text ${timerClass}`}
        style={{ color: getColor() }}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
      <div className="turnIndicator">
        <p>
          Turno: <strong>{currentPlayer}</strong>
        </p>
      </div>
      <div
        className="color-bloqueado"
        style={{
          backgroundColor: colorBloqueado,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "40px",
          marginLeft: "-1px", // Ajusta este valor según sea necesario
        }}
      >
        <span style={{ fontSize: "25px", marginRight: "10px" }}>🔒</span>{" "}
        {/* Aumentar el tamaño del candado */}
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: colorBloqueado,
            borderRadius: "50%", // Redondear para que parezca un círculo
            display: "inline-block",
          }}
        />
      </div>
    </div>
  );
};

export default Temporizador;
