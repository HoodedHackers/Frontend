import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Developer.css";

const developers = [
  { name: "Allasia, Emanuel", img: "/Imagenes/developers/ema.jpeg" },
  { name: "Arias, Eliana", img: "/Imagenes/developers/eli.jpeg" },
  { name: "Gutiérrez, Camilo", img: "/Imagenes/developers/milo.jpeg" },
  { name: "Mamani, Lourdes", img: "/Imagenes/developers/lu.jpeg" },
  { name: "Reyes, Lourdes", img: "/Imagenes/developers/lou.jpeg" },
  { name: "Scantamburlo, Matías", img: "/Imagenes/developers/mati.jpeg" },
  { name: "Villagra, Andrés", img: "/Imagenes/developers/andy.jpeg" },
];

const Developer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);
  const navigate = useNavigate(); // Para redirigir al login

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % developers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + developers.length) % developers.length
    );
  };

  const handleGoBack = () => {
    navigate("/"); // Redirigir al login
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error al intentar reproducir el audio:", error);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="carousel-overlay">
      <h1 className="carousel-title">Desarrolladores</h1>
      <div className="carousel-3d-container">
        {developers.map((developer, index) => (
          <div
            key={index}
            className={`carousel-3d-card ${index === currentIndex ? "active" : ""}`}
            style={{
              transform: `rotateY(${(index - currentIndex) * (360 / developers.length)}deg) translateZ(400px)`,
            }}
          >
            <img src={developer.img} alt={developer.name} className="carousel-image" />
            <div className="carousel-info">
              <h2>{developer.name}</h2>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-button prev" onClick={handlePrev}>◀</button>
      <button className="carousel-button next" onClick={handleNext}>▶</button>

      {/* Elemento de audio que se reproduce automáticamente */}
      <audio ref={audioRef} loop>
        <source src="/Hollow Knight OST - Kingdom's Edge.mp3" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>

      {/* Botón para redirigir al login */}
      <button className="navigate-button" onClick={handleGoBack}>
        Volver al Login
      </button>
    </div>
  );
};

export default Developer;
