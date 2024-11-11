import { useContext } from "react";
import { PartidaContext } from "../PartidaProvider.jsx";
import "./CartaMovimiento.css";

const CartaMovimiento = ({ id, ubicacion, index }) => {
  const Images = [
    "/Imagenes/Movimiento/mov7.svg",
    "/Imagenes/Movimiento/mov1.svg",
    "/Imagenes/Movimiento/mov2.svg",
    "/Imagenes/Movimiento/mov3.svg",
    "/Imagenes/Movimiento/mov4.svg",
    "/Imagenes/Movimiento/mov6.svg",
    "/Imagenes/Movimiento/mov5.svg"
  ];

  const { 
    setJugandoMov,
    handleMouseEnter,
    handleMouseLeave,
    seleccionadaMov,
    setSeleccionadaMov,
    setSeleccionadaFig,
    setJugandoFig,
    activePlayer
  } = useContext(PartidaContext);
  const isActive = id === seleccionadaMov;
  const isDisabled = activePlayer.player_id !== parseInt(sessionStorage.getItem("player_id"), 10);

  const usarCartaMovimiento = async () => {
    if (isDisabled) {
      return;
    }
    setSeleccionadaFig({});
    setJugandoFig(false);
    setJugandoMov(true);
    if (seleccionadaMov != id) {
      setSeleccionadaMov(id);
      const game_id = sessionStorage.getItem("partida_id");
      const message = {
        identifier: sessionStorage.getItem("identifier"),
        card_id: id,
        card_index: index,
        game_id: game_id
      };

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/lobby/${game_id}/use_movement_card`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });
        if (!response.ok) {
          throw new Error("Error al enviar la Carta de Movimiento elegida: ", response);
        }
        else {
          console.log("Se envió la Carta de Movimiento elegida.");
        }
      } catch (error) {
        console.error("Error al enviar la Carta de Movimiento elegida: ", response);
      }    
    }
  };

  return ubicacion === 0 ? (
    <div
    className={`carta-movimiento ${isActive ? "activa" : ""} ${isDisabled ? "disabled" : ""}`}
      onClick={usarCartaMovimiento}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={id == -1 ? "/Imagenes/Movimiento/back-mov.svg" : Images[(id % 7)]} 
        alt={id == -1 ? "Carta de Movimiento 0" : `Carta de Movimiento ${(id % 7) + 1}`}
        className="carta-movimiento-img"
      />
    </div>
  ) : (
    <div className={"carta-movimiento-sin-hover"}>
      <img
        src={id == -1 ? "/Imagenes/Movimiento/back-mov.svg" : Images[(id % 7)]} 
        alt={id == -1 ? "Carta de Movimiento 0" : `Carta de Movimiento ${(id % 7) + 1}`}
        className="carta-movimiento-img"
      />
    </div>
  );
};

export default CartaMovimiento;
