import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./login.css";

const Login = () => {
  const { register, handleSubmit, formState } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const manejarBotonInicioSesion = async (data) => {
    try {
      const response = await fetch("https://httpbin.org/post", {
        mode: 'cors',
        credentials: 'include',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.[0]?.msg || "Error en la solicitud");
      }

      return await response.json();
    } catch (error) {
      setErrorMessage(error.message);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    setErrorMessage("");
    try {
      const resultado = await manejarBotonInicioSesion(data);
      console.log("Éxito:", resultado);

      localStorage.setItem("nickname", data.nickname);

      navigate("/Opciones");
    } catch (error) {
      console.error("Error durante la solicitud:", error);
    }
  };

  return (
    <div className="root">
      <div className="login-container">
        <h2 className="login-title">¡Bienvenido a "El Switcher"!</h2>
        <div className="form-container">
          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input
                id="nickname"
                type="text"
                placeholder="Nickname"
                {...register("nickname", {
                  required: { value: true, message: "El campo nickname es requerido." },
                  maxLength: { value: 64, message: "Solo se permiten 64 caracteres." },
                })}
              />
              {formState.errors.nickname && (
                <span className="error-message">
                  {formState.errors.nickname.message}
                </span>
              )}
            </div>
            {/* Botón dentro del formulario */}
            <button type="submit" className="custom-button">
              Iniciar
            </button>
          </form>
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
