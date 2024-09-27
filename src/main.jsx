import "./index.css";
import { StrictMode } from 'react'; // Importa StrictMode
import { createRoot } from 'react-dom/client' // Importa createRoot desde react-dom/client
import { BrowserRouter, Route , Routes } from 'react-router-dom'; // Importa BrowserRouter
import AbandonarPartida from './components/AbandonarPartida'; // Importa el componente CrearPartida

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/Partida/:id' element={<AbandonarPartida />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
