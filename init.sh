
kubectl apply -k .
kind load docker-image abd-tc01-frontend

ls -1 *.yaml | tr '\n' ','
ls -1 *.yaml | tr '\n' ',' | sed 's/.$//'

backend-cm0-configmap.yaml,backend-cm1-configmap.yaml,backend-cm2-configmap.yaml,backend-cm3-configmap.yaml,backend-deployment.yaml,backend-service.yaml,database-cm1-configmap.yaml,database-deployment.yaml,database-service.yaml,frontend-cm0-configmap.yaml,frontend-cm1-configmap.yaml,frontend-cm2-configmap.yaml,frontend-deployment.yaml,frontend-service.yaml,keycloak-cm0-configmap.yaml,keycloak-deployment.yaml,keycloak-service.yaml,pgdata-persistentvolumeclaim.yaml
