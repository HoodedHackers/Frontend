from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Habilitar CORS para que React pueda hacer solicitudes al backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/lobby")
def obtener_partidas():
    return [
        {"id": 1, "nombre": "Partida Milo", "jugadores": 2, "max_jugadores": 4},
        {"id": 2, "nombre": "Partida Ely", "jugadores": 2, "max_jugadores": 4},
        {"id": 3, "nombre": "Partida Ema", "jugadores": 2, "max_jugadores": 4},
        {"id": 4, "nombre": "Partida Andy", "jugadores": 2, "max_jugadores": 4},
        {"id": 5, "nombre": "Partida Lou", "jugadores": 4, "max_jugadores": 4},
    ]
