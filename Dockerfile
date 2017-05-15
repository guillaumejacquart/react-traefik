FROM node:7-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies

# Bundle app source
COPY . /usr/src/app
RUN npm install --production

EXPOSE 3001

CMD [ "npm", "start" ]