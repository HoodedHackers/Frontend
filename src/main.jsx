import "./Style/index.css"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Listar_Partidas from './Listar_Partidas.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Listar_Partidas />
  </StrictMode>,
)
