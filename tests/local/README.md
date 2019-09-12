Used for local testing against different versions using the UI:

To start a version:

docker-compose -f v2_docker_compose.yml up --force-recreate

docker-compose -f v5_docker_compose.yml up --force-recreate

docker-compose -f v6_docker_compose.yml up --force-recreate

docker-compose -f v7_docker_compose.yml up --force-recreate

The versions will run on different ports:

V2: 9200
V5: 8200
V6: 7200
V7: 6200