FROM node:23-alpine

WORKDIR /app

COPY  package-lock.json ./

COPY  npm install

COPY  . .

EXPOSE 3000


CMD ["npm", "start"]