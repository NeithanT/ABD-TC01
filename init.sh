#!/usr/bin/env bash

set -e

# 1. Comprobar herramientas requeridas
COMMANDS=("docker" "kind" "kubectl")

echo "== Verificando herramientas requeridas =="
for cmd in "${COMMANDS[@]}"; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Error: '$cmd' no está instalado o no se encuentra en el PATH." >&2
    exit 1
  fi
  echo "$cmd está instalado."
done

# Verificar si Docker daemon está corriendo
if ! docker info >/dev/null 2>&1; then
  echo "Error: El servicio de Docker no se está ejecutando o el usuario no tiene permisos." >&2
  exit 1
fi

# 2. Crear cluster de Kind si no existe
CLUSTER_NAME="kind"
if kind get clusters 2>/dev/null | grep -qx "$CLUSTER_NAME"; then
  echo "== El cluster de Kind '$CLUSTER_NAME' ya existe =="
else
  echo "== Creando cluster de Kind con kind-config.yaml =="
  kind create cluster --config kind-config.yaml
fi

# 3. Compilar / construir imágenes con Docker Compose
echo "== Construyendo imágenes con Docker Compose =="
docker compose build

# 4. Cargar imágenes a Kind
echo "== Cargando imágenes en Kind =="
kind load docker-image abd-tc01-backend:latest
kind load docker-image abd-tc01-frontend:latest

# 5. Aplicar manifiestos con Kustomize
echo "== Aplicando deployments con kubectl apply -k . =="
kubectl apply -k .

echo "== Exitoso!! =="
