#!/usr/bin/env sh

# Set Flyway environment variables
export FLYWAY_LOCATIONS="filesystem:/flyway/sql"
export FLYWAY_URL="jdbc:postgresql://coolanu-db:5432/coolanu"
export FLYWAY_USER="coolanu"
export FLYWAY_PASSWORD="coolanu"

# Attempt to pull the Flyway image (but don't fail if it doesn't work)
docker pull flyway/flyway:6.3.1 || true

# Get container ID, if it exists
CONTAINER_ID=$(docker container ls -a --filter "name=coolanu-migration" -q)

# Stop and remove the container if it exists
if [ ! -z "$CONTAINER_ID" ]; then
  docker stop "$CONTAINER_ID"
  docker rm "$CONTAINER_ID"
fi

# Run the Flyway migration
docker run --rm \
  --name "coolanu-migration" \
  -v "$(pwd)/migrations:/flyway/sql" \
  -e FLYWAY_LOCATIONS \
  -e FLYWAY_URL \
  -e FLYWAY_USER \
  -e FLYWAY_PASSWORD \
  flyway/flyway:6.3.1 \
  migrate
