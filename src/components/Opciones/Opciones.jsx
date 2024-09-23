import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Opciones.module.css";

const Opciones = () => {
  const navigate = useNavigate();
  const nickname = localStorage.getItem("nickname");

  const handleCreateGame = () => {
    const jugador1 = localStorage.getItem("nickname") || "Jugador1"; // Obtener nickname del localStorage
    const jugadores = [jugador1, "Jugador2", "Jugador3", "Jugador4"]; // Personaliza más nombres
    
    localStorage.setItem("jugadores", JSON.stringify(jugadores)); // Guardar en localStorage
    navigate("/Partida");
  };
  
  const handleJoinGame = () => {
    navigate("/Partida");
  };

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Bienvenid@, {nickname}!</h1>
      <h2 className={styles.subtitle}>Elegí una opción</h2>
      <button onClick={handleCreateGame} className={styles.customButton}>
        Crear Partida
      </button>
      <button onClick={handleJoinGame} className={styles.customButton}>
        Unirse a Partida
      </button>
    </div>
  );
};

export default Opciones;
