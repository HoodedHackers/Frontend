import {useNavigate} from "react-router-dom";

const Lobby = () => {
  const navigate = useNavigate();

  return (
    <div>
      Bienvenido/a {localStorage.getItem("nickname")}
      <span style={{color: "blue"}} onClick={() => navigate(-1)}>
        Volver.
      </span>
    </div>
  );
};
export default Lobby;