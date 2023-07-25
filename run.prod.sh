#!/bin/bash

source .env

if [ "$(docker-compose ps | grep "bot")" ]; then
    echo "Container already exists. Migration skipped."
else
    docker-compose up -d

    echo "Waiting for container database start..."
    sleep 10

    docker exec -it postgres psql -U "$DB_USER" -d postgres -c "DROP DATABASE $DB_NAME;"
    sleep 1
    docker exec -it postgres psql -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"
    sleep 1
    docker exec -i postgres /bin/bash -c "PGPASSWORD=$DB_PASSWORD psql --username $DB_USER $DB_NAME" < ./dumps/audiostick.sql
fi

docker-compose up
