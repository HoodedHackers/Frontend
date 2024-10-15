import React, { useContext } from 'react';
import { TableroContext, TableroProvider } from './TableroProvider.jsx'; // Asegúrate de que la ruta es correcta
import './TableroContainer.css'; // Cambia a CSS normal

function Square({ color, onClick, isSelected }) {
  const { colorToImageMap } = useContext(TableroContext);
  
  return (
    <button
      className={`${isSelected ? 'square selected' : 'square'}`} 
      style={{
        backgroundImage: `url(${colorToImageMap[color]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center', 
      }}
      onClick={onClick}
    />
  );
}

function Tablero() {
  const { squares, handleSquareClick, selectedIndex } = useContext(TableroContext);

  return (
    <>
      {[0, 6, 12, 18, 24, 30].map(rowStart => (
        <div className="boardRow" key={rowStart}> {/* Cambia de styles.boardRow a clase normal */}
          {squares.slice(rowStart, rowStart + 6).map((color, i) => (
            <Square
              key={i + rowStart}
              color={color}
              onClick={() => handleSquareClick(rowStart + i)}
              isSelected={selectedIndex === rowStart + i}
            />
          ))}
        </div>
      ))}
    </>
  );
}

function TableroContainer() {
  return (
    <div className="boardContainer"> 
      <Tablero />
    </div>
  );
}

export default function TableroWithProvider() {
  return (
    <TableroProvider>
      <TableroContainer />
    </TableroProvider>
  );
}
