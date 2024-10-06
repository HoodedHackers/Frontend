import Listar_Partidas from "./listar_partidas/listar_partidas.jsx";
import CrearPartida from "./CrearPartida/CrearPartida";
import "./Opciones.css";

function Opciones() {
  
    return (
      <div className="opciones-container">  
        <div className="form-container"> 
          <CrearPartida />
        </div>
        <div className="list-container">
          <Listar_Partidas jugador_id={"sdsda"} />
        </div>
      </div>
    );
  }
  
  export default Opciones;