import "./PasarTurno.css";

function PasarTurno({
  onTurnoCambiado,
  tiempoLimite,
  setTimeLeft,
  disabled,
}) {
  const game_id = sessionStorage.getItem("partida_id");
	let identifier = sessionStorage.getItem("identifier");
  if (!game_id) {
    console.error("partidaId no está definido en sessionStorage");
    return;
  }
  const pasarTurno = async () => {
    if (identifier === null) {
      console.error("identificador de jugador no definido");
      return;
    }

    // Reiniciar el temporizador antes de cambiar el turno
    setTimeLeft(tiempoLimite);

    // Enviar actualización del turno al backend vía fetch
    try {
      const response = await fetch(`http://localhost:8000/api/lobby/${game_id}/advance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifier,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`Error al pasar el turno: ${response.status} - ${responseData.detail}`);
      }
      if (responseData.status === "success") {
        onTurnoCambiado(); // Notificar que el turno cambió correctamente
      }
    } catch (error) {
      console.error("Error en la conexión al servidor:", error);
    }
  };

  return (
    <button
      onClick={pasarTurno}
      disabled={disabled}
      className={`boton ${(disabled) ? "botonDeshabilitado" : ""}`}
    >
      Terminar Turno
    </button>
  );
}

export default PasarTurno;