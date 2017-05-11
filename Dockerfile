FROM node:boron-slim

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies

# Bundle app source
COPY . /usr/src/app
RUN npm install

EXPOSE 3001

CMD [ "npm", "start" ]