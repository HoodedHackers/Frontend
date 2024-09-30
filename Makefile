all: dev

build:
	npm run build

clean:
	rm -rf dist

deepclean: clean
	rm -rf node_modules

dev:
	npm run dev

docker-build:
	docker build -t switcher-front:dev .

docker-start:
	docker run -p 8080:80 switcher-front:dev

help:
	@echo "Comandos disponibles:"
	@echo "  build        - Construye el proyecto usando npm"
	@echo "  clean        - Elimina el directorio 'dist'"
	@echo "  deepclean    - Elimina 'dist' y 'node_modules'"
	@echo "  dev          - Ejecuta el entorno de desarrollo con npm"
	@echo "  docker-build - Construye la imagen Docker con la etiqueta 'switcher-front:dev'"
