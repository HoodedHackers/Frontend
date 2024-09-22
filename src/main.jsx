/*manejo de ruteos*/
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Opciones from "./components/Opciones/Opciones.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Partida from "./components/Partida/Partida.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/Opciones' element={<Opciones />} />
        <Route path="/Partida" element={<Partida />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);