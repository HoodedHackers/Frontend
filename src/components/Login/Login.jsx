import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ParticlesBackground from "./ParticlesBackground";
import styles from "./Login.module.css";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const manejarBotonInicioSesion = async (data) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: data.nickname }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          if (errorData.error === "nickname_empty") {
            throw new Error("El campo de nombre no puede estar vacío.");
          } else if (errorData.error === "nickname_too_long") {
            throw new Error("El nombre de usuario supera los 64 caracteres.");
          }
        }
        throw new Error(errorData.detail || "Error en la respuesta del servidor");
      }

    const result = await response.json();
    console.log("Nombre agregado:", result);
    sessionStorage.setItem("player_nickname", data.nickname);
    sessionStorage.setItem("player_id", result.id);
    sessionStorage.setItem("identifier", result.identifier);
    navigate("/Opciones");
  } catch (error) {
    setErrorMessage(error.message || "Error en la solicitud");
    console.error("Error durante la solicitud:", error);
  }
};

  

  const onSubmit = async (data) => {
    setErrorMessage("");
    try {
      await manejarBotonInicioSesion(data);
    } catch (error) {
      console.error("Error durante la solicitud:", error);
    }
  };

  return (
    <div className={styles.root}>
      <ParticlesBackground /> {/* Agrega el fondo de partículas aquí */}
      <h2 className={styles.title}>¡Bienvenido a "El Switcher"!</h2>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formGroup}>
              <input
                className={styles.input}
                id="nickname"
                type="text"
                placeholder="Nickname"
                {...register("nickname", {
                  required: { value: true, message: "El campo no puede estar vacío." },
                  maxLength: { value: 64, message: "Solo se permiten 64 caracteres." },
                })}
              />
              {errors.nickname && <span className={styles.error}>{errors.nickname.message}</span>}
            </div>
            <button type="submit" className={styles.customButton}>
              Iniciar
            </button>
          </form>
          {errorMessage && <span className={styles.error}>{errorMessage}</span>}
        </div>
        
        <div className={styles.infoContainer}>
          <div className={styles.card}>
            <h2 className={styles['card-title']}>¿Qué es Switcher?</h2>
            <p className={styles['card-text']}>
              El Switcher es un juego de mesa de estrategia e ingenio, en el que los jugadores deberán
              formar figuras determinadas, moviendo las fichas en el tablero, según las tarjetas
              de movimiento. Cada jugador tendrá un mazo con figuras para ir descartando a medida
              que se formen en el tablero y evitando que otros jugadores completen sus figuras.
              Quién primero termine sus cartas de figura será el ganador.
            </p>
            <h2 className={styles['card-title']}>¿Cómo jugar?</h2>
            <a href="https://maldon.com.ar/wp-content/uploads/2018/09/Reglamento-el-Switcher-2018.pdf" target="_blank" rel="noopener noreferrer">
              <button className={styles['custom-button']}>Descargar reglas</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;