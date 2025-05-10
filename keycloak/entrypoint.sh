#!/bin/bash

# Run original Keycloak entrypoint
/opt/keycloak/bin/kc.sh start-dev &

# Wait for Keycloak to start
until curl -f http://localhost:8080/auth/realms/master; do
  sleep 5
done

# Run initialization script
/keycloak-init.sh

# Keep container running
wait