import "./index.css";
import { StrictMode } from 'react'; // Importa StrictMode
import { createRoot } from 'react-dom/client' // Importa createRoot desde react-dom/client
import { BrowserRouter, Route , Routes } from 'react-router-dom'; // Importa BrowserRouter
import AbandonarPartida from './components/AbandonarPartida'; // Importa el componente CrearPartida
import MazoCartaFigura from './components/MazoCartaFigura';
import Login from './components/Login/Login.jsx';
import Opciones from './components/Opciones/Opciones.jsx';
import Partida from './components/Partida/Partida.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Opciones' element={<Opciones />} />
        <Route 
          path='/Partida/:id' 
          element={
            <>
              <AbandonarPartida />
              <MazoCartaFigura />
            </>
          } 
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

i