FROM node:12.16

WORKDIR /lib

COPY package*.json ./
RUN npm install

COPY . .