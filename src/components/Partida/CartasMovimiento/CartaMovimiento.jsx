import React, { useContext } from "react";
import { PartidaContext } from "../PartidaProvider.jsx";
import { CartasMovimientoContext } from "./CartasMovimientoMano.jsx";
import { WebSocketContext } from "../../WebSocketsProvider.jsx";
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

  const { setJugando, handleMouseEnter, handleMouseLeave } =
    useContext(PartidaContext);

  const { seleccionada, setSeleccionada } = useContext(CartasMovimientoContext);

  const { wsUCMRef } = useContext(WebSocketContext);

  const isActive = id === seleccionada;

  const usarCartaMovimiento = () => {
    setJugando(true);
    if (seleccionada != id) {
      setSeleccionada(id);
      const message = {
        player_identifier: sessionStorage.getItem("identifier"),
        card_id: id,
        index: index
      };
      wsUCMRef.current.send(JSON.stringify(message));
      console.log("Se envió la Carta de Movimiento elegida.");
    }
  };

  return ubicacion === 0 ? (
    <div
      className={`carta-movimiento ${isActive ? "activa" : ""}`}
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
