import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import Opciones from './components/Opciones/Opciones.jsx';
import PartidaWithProvider from './components/Partida/Partida.jsx';
import { WebSocketProvider } from './components/WebSocketsProvider.jsx';

createRoot(document.getElementById("root")).render(
  <WebSocketProvider>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/Opciones' element={<Opciones />} />
          <Route path='/Partida/:id' element={<PartidaWithProvider />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </WebSocketProvider>
);