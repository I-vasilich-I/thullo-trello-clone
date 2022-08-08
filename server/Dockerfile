FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE ${PORT}

CMD [ "npm", "run", "start:dev" ]
