#!/usr/bin/env bash

# Detiene el script inmediatamente si algun comando falla.
set -e


# Levanta todos los servicios definidos en docker-compose.yml.
# --build reconstruye las imagenes si hubo cambios.
# -d deja los contenedores ejecutandose en segundo plano.
# --wait espera a que los servicios esten listos antes de continuar.
echo "== Levatando Docker Compose =="
docker compose up -d --build --wait


# Ejecuta las pruebas unitarias y de integracion dentro del contenedor backend.
# -T evita crear una terminal interactiva, ya que el comando se ejecuta automaticamente.
echo "== Ejecutando pruebas unitarias e integracion =="
docker compose exec -T backend npm test


# Crea una estrella mediante el endpoint del backend
echo "== Creando dato para prueba de persistencia =="
docker compose exec -T backend \
  node tests/integration/persistence.integration.ts crear


# Destruye los contenedores y redes de Compose
echo "== Bajando contenedores sin borrar volumenes =="
docker compose down


# Vuelve a crear los contenedores utilizando el mismo volumen de PostgreSQL
# --wait evita continuar hasta que los servicios vuelvan a estar disponibles.
echo "== Levantando nuevamente Docker Compose =="
docker compose up -d --wait


# Comprueba que la estrella creada antes del docker compose down
# siga existiendo despues de volver a levantar el sistema
echo "== Verificando persistencia =="
docker compose exec -T backend \
  node tests/integration/persistence.integration.ts verificar

echo "== Apagando Docker Compose =="

# Si el script llego hasta aqui, ninguno de los comandos anteriores fallo
echo "== TODAS LAS PRUEBAS PASARON =="
