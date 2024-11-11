import React, { useContext } from 'react';
import { TableroContext, TableroProvider } from './TableroProvider.jsx';
import { PartidaContext } from '../PartidaProvider.jsx';
import './TableroContainer.css';

function Square({ color, onClick, isSelected, isHighlighted }) {
  const { colorToImageMap } = useContext(TableroContext);
  const { jugando } = useContext(PartidaContext);
  
  return (
    <button
      className={`square ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`} 
      style={{
        backgroundImage: `url(${colorToImageMap[color]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center', 
      }}
      onClick={onClick}
      disabled={!jugando}
    />
  );
}

function Tablero() {
  const { squares, handleSquareClick, selectedIndex } = useContext(TableroContext);
  return (
    <>
      {[0, 6, 12, 18, 24, 30].map(rowStart => (
        <div className="boardRow" key={rowStart}>
          {squares.slice(rowStart, rowStart + 6).map(({color, highlighted}, i) => (
            <Square
              key={i + rowStart}
              color={color}
              onClick={() => handleSquareClick(rowStart + i)}
              isSelected={selectedIndex === rowStart + i}
              isHighlighted={highlighted}
              selected={rowStart + i === selectedIndex}
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
