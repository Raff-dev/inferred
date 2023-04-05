FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
