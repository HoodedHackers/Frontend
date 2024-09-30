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
        {"id": 1, "name": "Partida Milo", "jugadores": 2, "max_players": 4},
        {"id": 2, "name": "Partida Ely", "jugadores": 2, "max_players": 4},
        {"id": 3, "name": "Partida Ema", "jugadores": 2, "max_players": 4},
        {"id": 4, "name": "Partida Andy", "jugadores": 2, "max_players": 4},
        {"id": 5, "name": "Partida Lou", "jugadores": 4, "max_players": 4},
    ]

@app.put("/api/lobby/{id_partida}")
def unirse_partida(id_partida: int):
    print(f"ID de partida: {id_partida}")