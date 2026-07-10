FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache wget

COPY package*.json ./

RUN npm install

EXPOSE 3187

CMD ["npm", "run", "start:dev"]
