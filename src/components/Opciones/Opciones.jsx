import ListarPartidas from "./ListarPartidas/ListarPartidas.jsx";
import CrearPartida from "./CrearPartida/CrearPartida.jsx";
import { useNavigate } from "react-router-dom";
import "./Opciones.css";

function Opciones() {
  const navigate = useNavigate();
  const partidaId = sessionStorage.getItem("partida_id");
  console.log(partidaId);
  const partidaIniciada = sessionStorage.getItem("partidaIniciada");

  const goGame = () => {
    navigate(`/Partida/${partidaId}`);
  };

  console.log(partidaIniciada);

  return (
    <div className="opciones-container">
      <button onClick={goGame} className="go-game-button">
        <i className="fas fa-arrow-right"></i>
      </button>
      <div className="titulo-container">
        <h2 className="titulo-opciones">ELEGÍ UNA OPCIÓN</h2>
      </div>
      <div className="form-container">
        <CrearPartida />
      </div>
      <div className="list-container">
        <ListarPartidas />
      </div>
    </div>

  );
}

export default Opciones;