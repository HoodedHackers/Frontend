import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import Opciones from './components/Opciones/Opciones.jsx';
import Partida from './components/Partida/Partida.jsx';

createRoot(document.getElementById("root")).render(
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Opciones' element={<Opciones />} />
        <Route path='/Partida/:id' element={<Partida />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);