import Listar_Partidas from "./listar_partidas/listar_partidas.jsx";
import Crear_Partida from "./crear_partida/crear_partida";
import "./Opciones.css";

function Opciones() {
  
    return (
      <div className="opciones-container">  
        <div className="form-container"> 
          <Crear_Partida />
        </div>
        <div className="list-container">
          <Listar_Partidas jugador_id={"sdsda"} />
        </div>
      </div>
    );
  }
  
  export default Opciones;