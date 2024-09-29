import "./index.css";
import { StrictMode } from 'react'; 
import { createRoot } from 'react-dom/client' 
import { BrowserRouter, Route , Routes } from 'react-router-dom'; 
import CrearPartida from './components/CrearPartida'; 

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