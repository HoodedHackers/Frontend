// TableroContainer.jsx
import React, { useContext } from 'react';
import { TableroContext, TableroProvider } from './TableroProvider.jsx'; // Asegúrate de que la ruta es correcta
import styles from './TableroContainer.module.css';

function Square({ color, onClick, isSelected }) {
  const { colorToImageMap } = useContext(TableroContext);
  
  return (
    <button
      className={`${styles.square} ${isSelected ? styles.selected : ''}`}
      style={{
        backgroundImage: `url(${colorToImageMap[color]})`,
        backgroundSize: 'cover', // Ajusta la imagen para cubrir todo el botón
        backgroundPosition: 'center', // Centra la imagen
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
        <div className={styles.boardRow} key={rowStart}>
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
    <div className={styles.boardContainer}>
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
