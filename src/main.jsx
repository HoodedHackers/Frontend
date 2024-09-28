import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MazoCartaFigura from './components/MazoCartaFigura'
import CartaFigura from './components/CartaFigura'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div>
      <MazoCartaFigura />
    </div>
  </StrictMode>
)
