import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import './login.css'


const Login = () => {
  const form = useForm();
  const navigate = useNavigate();
  const manejarBotonInicioSesion = async (data) => {
    const response = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  };

  const onSubmit = async (data) => {
    try {
      const resultado = await manejarBotonInicioSesion(data); // Hacemos el fetch
      console.log("Éxito:", resultado);

      // Guardamos el nickname en el localStorage
      localStorage.setItem("nickname", data.nickname);

      // Redirigimos al lobby
      navigate("/CrearPartida");
    } catch (error) {
      console.error("Error durante la solicitud:", error);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="El switcher"
            className="logo"
            src="/switcher.png"
          />
          <h2 className="mt-12 text-center text-3xl font-custom tracking-widest text-white">
            Bienvenidos a "El Switcher"
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={form.handleSubmit(onSubmit)} className="form">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="">Ingresa tu nickname</label>
              <input
                {...form.register("nickname", {
                  required: {
                    value: true,
                    message: "El campo nickname es requerido.",
                  },
                  maxLength: {
                    value: 64,
                    message: "Solo se permiten 64 caracteres.",
                  },
                })}
              />
              {form.formState.errors.nickname && (
                <span style={{ color: "red", fontSize: "13px" }}>
                  {form.formState.errors["nickname"].message}
                </span>
              )}
            </div>
            <button
              type="submit"
              variant="outlined"
              className="custom-button"
            >
              Iniciar sesion
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
export default Login;
