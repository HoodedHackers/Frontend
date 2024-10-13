import ListarPartidas from "./ListarPartidas/ListarPartidas.jsx";
import CrearPartida from "./CrearPartida/CrearPartida.jsx";
import "./Opciones.css";

function Opciones() {

  return (
    <div className="opciones-container">
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