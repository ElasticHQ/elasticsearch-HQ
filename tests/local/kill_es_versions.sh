#!/bin/bash

docker-compose -f v2/docker-compose.yml down
docker-compose -f v5/docker-compose.yml down
docker-compose -f v6/docker-compose.yml down
docker-compose -f v7/docker-compose.yml down
