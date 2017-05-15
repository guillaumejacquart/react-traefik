# react-traefik

Interactive diagram view for traefik using React and D3

# Setup
The easiest way to install the package is using docker. The docker runs a web application that talks to the traefik api and exposes its own api for the dashboard to call.

## Using docker
The host you run the docker container on must have access to the traefik frontend for it to work.
```sh
docker run -d -p 3001:3001 --network=<traefik_network> ghiltoniel/traefik-react
```

Then go to [http://localhost:3001](http://localhost:3001) to access the dashboard

