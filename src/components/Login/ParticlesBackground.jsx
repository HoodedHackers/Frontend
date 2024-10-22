// ParticlesBackground.js
import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { polygonPathName, loadPolygonPath } from "tsparticles-path-polygon";
import './ParticlesBackground.css';


const ParticlesBackground = () => {
  const particlesInit = useCallback((engine) => {
    loadPolygonPath(engine);
  }, []);

  const option = {fpsLimit: 60,
  particles: {
    color: {
        value: ["#00FF00", "#0000FF", "#FF0000", "#FFFF00"], // Verde, Azul, Rojo, Amarillo
      animation: {
        enable: false,
      }
    },
    move: {
      attract: {
        enable: true,
        rotate: {
          distance: 100,
          x: 2000,
          y: 2000
        }
      },
      direction: "none",
      enable: true,
      outModes: {
        default: "destroy"
      },
      path: {
        clamp: false,
        enable: true,
        delay: {
          value: 0
        },
        generator: polygonPathName,
        options: {
          sides: 6,
          turnSteps: 30,
          angle: 30
        }
      },
      random: false,
      speed: 3,
      straight: false,
      trail: {
        fillColor: "#404040",
        length: 40,
        enable: true
      }
    },
    number: {
      density: {
        enable: true,
        area: 800
      },
      value: 0
    },
    opacity: {
      value: 1
    },
    shape: {
      type: "circle"
    },
    size: {
      value: 3
    }
  },
  background: {
    color: "#101010"
  },
  fullScreen: {
    zIndex: -1
  },
  detectRetina: true,
  emitters: {
    direction: "none",
    rate: {
      quantity: 1,
      delay: 0.25
    },
    size: {
      width: 0,
      height: 0
    },
    position: {
      x: 50,
      y: 0
    }
  }
  }
  return (
    <Particles
      options={option }
        
      init={particlesInit}
    />
  );
};

export default ParticlesBackground;
