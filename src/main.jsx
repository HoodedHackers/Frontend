import "./index.css"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Partida from './components/Partida/Partida.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/Partida/:id" element={<Partida />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);