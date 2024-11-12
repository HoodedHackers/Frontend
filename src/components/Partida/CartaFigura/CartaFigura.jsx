// src/components/CartaFigura.jsx
import React, { useContext } from 'react';
import { PartidaContext } from '../PartidaProvider.jsx';
// import PropTypes from 'prop-types';
import './CartaFigura.css'; 

function CartaFigura({ tipo, possibleFigures, colorBloqueado }) {
  const Images = [
    "/Imagenes/Figura/25.svg",
    "/Imagenes/Figura/1.svg",
    "/Imagenes/Figura/2.svg",
    "/Imagenes/Figura/3.svg",
    "/Imagenes/Figura/4.svg",
    "/Imagenes/Figura/5.svg",
    "/Imagenes/Figura/6.svg",
    "/Imagenes/Figura/7.svg",
    "/Imagenes/Figura/8.svg",
    "/Imagenes/Figura/9.svg",
    "/Imagenes/Figura/10.svg",
    "/Imagenes/Figura/11.svg",
    "/Imagenes/Figura/12.svg",
    "/Imagenes/Figura/13.svg",
    "/Imagenes/Figura/14.svg",
    "/Imagenes/Figura/15.svg",
    "/Imagenes/Figura/16.svg",
    "/Imagenes/Figura/17.svg",
    "/Imagenes/Figura/18.svg",
    "/Imagenes/Figura/19.svg",
    "/Imagenes/Figura/20.svg",
    "/Imagenes/Figura/21.svg",
    "/Imagenes/Figura/22.svg",
    "/Imagenes/Figura/23.svg",
    "/Imagenes/Figura/24.svg",
  ];

  const { 
    setJugandoFig,
    seleccionadaFig,
    setSeleccionadaFig,
    setSeleccionadaMov,
    setJugandoMov,
    activePlayer
  } = useContext(PartidaContext);
  const isActive = tipo === seleccionadaFig;
  const isDisabled = activePlayer.player_id !== parseInt(sessionStorage.getItem("player_id"), 10);

  const usarCartaFigura = async () => {
    if (isDisabled) {
      return;
    }
    setSeleccionadaMov({});
    setJugandoMov(false);
    setJugandoFig(true);
    if (seleccionadaFig != tipo) {
      setSeleccionadaFig(tipo);  
    }

    const game_id = sessionStorage.getItem("partida_id");
    const identifier = sessionStorage.getItem("identifier");
    const player_id = sessionStorage.getItem("player_id");
    var my_moves = null;
    var selected_move = null;
    for (let posibilities of possibleFigures) {
      if (posibilities.player_id == player_id) {
        my_moves = posibilities.moves;
        break;
      }
    }
    for (let move of my_moves) {
      if (move.fig_id == tipo) {
        if (move.color != colorBloqueado) {
          selected_move = move;
          break;
        }
      }
    }
    if (selected_move === null) return;
    const message = {
      player_identifier: identifier,
      card_id: tipo,
      color: selected_move.color,
    };
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/in-course/${game_id}/discard_figs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        },
      );
      if (!response.ok) {
        throw new Error(
          "Error al enviar la Carta de Figura elegida: ",
          response,
        );
      } else {
        console.log("Se envió la Carta de Figura elegida.");
      }
    } catch (error) {
      console.error("Error al enviar la Carta de Figura elegida: ", response);
    }
  };

  return (
    <div 
      className={`carta-figura ${isActive ? "activa" : ""} ${isDisabled ? "disabled" : ""}`}
      onClick={usarCartaFigura}
      disabled={activePlayer.player_id !== parseInt(sessionStorage.getItem("player_id"), 10)}
    >
      <img 
        src={tipo == -1 ? "/Imagenes/Figura/back.svg" : Images[tipo % 25]} 
        alt={tipo == -1 ? "Carta de Movimiento 0" : `Carta de Movimiento ${(tipo % 25) + 1}`} 
        className='carta-figura-img'
      />
    </div>
  );
};

export default CartaFigura;
