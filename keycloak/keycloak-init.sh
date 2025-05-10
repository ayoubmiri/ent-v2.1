#!/bin/bash

# Wait for Keycloak to be ready
echo "Waiting for Keycloak to be ready..."
until curl -f http://keycloak:8080/auth/realms/master; do
  sleep 5
done

echo "Keycloak is ready. Configuring realm and client..."

# Get admin token
ADMIN_TOKEN=$(curl -s -X POST \
  http://keycloak:8080/auth/realms/master/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin" \
  -d "password=admin" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | jq -r '.access_token')

# Create realm
curl -s -X POST \
  http://keycloak:8080/auth/admin/realms \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "realm": "ent-realm",
    "enabled": true,
    "displayName": "EST Salé",
    "registrationAllowed": false
  }'

# Create client
curl -s -X POST \
  http://keycloak:8080/auth/admin/realms/ent-realm/clients \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "ent-client",
    "enabled": true,
    "publicClient": true,
    "redirectUris": ["http://localhost:3000/*"],
    "webOrigins": ["+"],
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": true,
    "serviceAccountsEnabled": false,
    "authorizationServicesEnabled": false
  }'

# Create roles
curl -s -X POST \
  http://keycloak:8080/auth/admin/realms/ent-realm/roles \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "etudiant"}'

curl -s -X POST \
  http://keycloak:8080/auth/admin/realms/ent-realm/roles \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "enseignant"}'

curl -s -X POST \
  http://keycloak:8080/auth/admin/realms/ent-realm/roles \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "admin"}'

echo "Keycloak configuration completed."