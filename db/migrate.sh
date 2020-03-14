#!/usr/bin/env sh

export FLYWAY_LOCATIONS=filesystem:/tmp/migrations
export FLYWAY_URL='jdbc:postgresql://host.docker.internal:5432/coolanu'
export FLYWAY_USER=coolanu
export FLYWAY_PASSWORD='coolanu'

docker pull flyway/flyway:6.3.1

docker container ls -a --filter "name=coolanu-migration" -q | xargs docker rm -f

docker run \
    --name "coolanu-migration" \
    -v $(pwd)/db/migrations:/tmp/migrations \
    -e FLYWAY_LOCATIONS \
    -e FLYWAY_URL \
    -e FLYWAY_USER \
    -e FLYWAY_PASSWORD \
    --rm \
    flyway/flyway:6.3.1 \
    migrate
