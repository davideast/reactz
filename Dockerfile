FROM node:10.15-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json package.json

RUN npm i

COPY . .

RUN npm run build

COPY package.pub.json dist/src/package.json

WORKDIR /app/dist

RUN npm pack src

WORKDIR /app


