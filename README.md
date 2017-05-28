# react-traefik

Interactive diagram view for traefik using React and D3

[![Codefresh build status]( https://g.codefresh.io/api/badges/build?repoOwner=guillaumejacquart&repoName=react-traefik&branch=latest&pipelineName=react-traefik&accountName=guillaumejacquart&type=cf-1)]( https://g.codefresh.io/repositories/guillaumejacquart/react-traefik/builds?filter=trigger:build;branch:latest;service:591aebd418391f000191df52~react-traefik)

![alt text](https://image.ibb.co/enAZi5/Sans_titre.png "Screenshot")

# Setup
The easiest way to install the package is using docker. The docker runs a web application that talks to the traefik api and exposes its own api for the dashboard to call.

## Using docker
The host you run the docker container on must have access to the traefik frontend for it to work.
```sh
docker run -d -p 3001:3001 --network=<traefik_network> ghiltoniel/traefik-react
```

Then go to [http://localhost:3001](http://localhost:3001) to access the dashboard
You must fill out the traefik API URL on the header bar to access the dashboard

## Traefik service discovery
The container can also automatically discover the traefik API using the docker API to get Traefik IP address. For that, you must map the docker socket to the container volumes :

```sh
docker run -d -p 3001:3001 --network=<traefik_network> -v /var/run/docker.sock:/var/run/docker.sock ghiltoniel/traefik-react
```

