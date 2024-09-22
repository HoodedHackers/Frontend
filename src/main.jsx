import "./Style/index.css"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Listar_Partidas from './Listar_Partidas.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/Lobby' element={<Listar_Partidas />}/>
        <Route path="/Partida/:id" />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);