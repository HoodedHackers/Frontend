import React, { useContext } from 'react';
import { TableroContext, TableroProvider } from './TableroProvider.jsx';
import { PartidaContext } from '../PartidaProvider.jsx';
import './TableroContainer.css';


function Square({ color, onClick, isSelected, isHighlighted }) {
  const { colorToImageMap, modoDaltonismo } = useContext(TableroContext);
  const { jugando } = useContext(PartidaContext);
  const imageUrl = colorToImageMap[modoDaltonismo ? 'daltonismo' : 'normal'][color];

  return (
    <button
      className={`square ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      style={{
        backgroundImage: `url(${imageUrl})`,
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
            />
          ))}
        </div>
      ))}
    </>
  );
}

function TableroContainer() {
  const { toggleModoDaltonismo, modoDaltonismo } = useContext(TableroContext);

  return (
    <div className="boardContainer">
      <button onClick={toggleModoDaltonismo} className="modoDaltonismoButton">
        {modoDaltonismo ? 'Modo Normal' : 'Modo Daltonismo'}
      </button>
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