# El Switcher

El Switcher es un juego de mesa de estrategia e ingenio, en el que los jugadores deberán
formar figuras determinadas, moviendo las fichas en el tablero, según las tarjetas
de movimiento. Cada jugador tendrá un mazo con figuras para ir descartando a medida
que se formen en el tablero y evitando que otros jugadores completen sus figuras.
Quién primero lo termine sus cartas de figura será el ganador.

# Como levantar

Para iniciar el front solo corra el comando:

```sh
make dev
```

Para correr un entorno "productivo" corra los comandos:

```sh
make docker-build
make docker-start
```

En caso de ya tener armada la imagen de docker solo `make docker-start`
levantara el front en modo de produccion.
