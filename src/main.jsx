import "./index.css";
import { StrictMode } from 'react'; // Importa StrictMode
import { createRoot } from 'react-dom/client' // Importa createRoot desde react-dom/client
import { BrowserRouter, Route , Routes } from 'react-router-dom'; // Importa BrowserRouter
import CrearPartida from './components/CrearPartida'; // Importa el componente CrearPartida

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<CrearPartida />}/>
        <Route path='/Partida/:id' />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);