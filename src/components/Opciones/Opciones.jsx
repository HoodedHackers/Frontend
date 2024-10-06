import ListarPartidas from "./ListarPartidas/ListarPartidas.jsx";
import CrearPartida from "./CrearPartida/CrearPartida";
import "./Opciones.css";

function Opciones() {
  
    return (
      <div className="opciones-container">  
        <div className="form-container"> 
          <CrearPartida />
        </div>
        <div className="list-container">
          <ListarPartidas jugador_id={"sdsda"} />
        </div>
      </div>
    );
  }
  
  export default Opciones;