/*manejo de ruteos*/
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import Partida from "./components/Partida/Partida.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
 <Partida />
  </StrictMode>
);