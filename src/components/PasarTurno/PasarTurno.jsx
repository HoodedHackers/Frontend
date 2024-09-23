import React from "react";
import styles from "./PasarTurno.module.css";

const PasarTurno = ({ onPasarTurno }) => {
  return (
    <button className={styles.botonPasarTurno} onClick={onPasarTurno}>
      Pasar Turno
    </button>
  );
};

export default PasarTurno;
