import { useNavigate } from 'react-router-dom';
import './AbandonarPartida.css';


const AbandonarPartida = () => {
    const navigate = useNavigate(); // Hook para navegar
  
    const manejadorAbandonarPartida = () => {
      navigate(-1); // Ir hacia atrás en la historia de navegación
    };
  
    return (
      <button 
        variant='contained'
        className='abandonar-partida-boton'
        onClick={manejadorAbandonarPartida}
      >
            Abandonar Partida
      </button>
    );
  };
  
  export default AbandonarPartida;