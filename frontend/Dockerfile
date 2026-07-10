FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache wget

COPY package*.json ./

RUN npm install

EXPOSE 4178

CMD ["npm", "run", "dev"]
