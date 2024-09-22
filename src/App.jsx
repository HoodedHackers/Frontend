import { useState } from 'react'
import './App.css'
import CrearPartida from './components/CrearPartida'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CrearPartida />
    </>
  )
}

export default App
