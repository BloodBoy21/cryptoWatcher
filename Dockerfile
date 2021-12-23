FROM node:17.2.0-stretch
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /app

COPY package.json /app
RUN npm install --legacy-peer-deps 
COPY . /app
CMD [ "node", "app.js" ]
EXPOSE 8080
