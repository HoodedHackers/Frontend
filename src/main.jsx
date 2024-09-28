import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MazoCartaFigura from './components/MazoCartaFigura'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MazoCartaFigura />
  </StrictMode>,
)
