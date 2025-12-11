FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache netcat-openbsd

COPY package*.json ./
RUN npm install

COPY . .
RUN chmod +x wait-for-redis.sh

EXPOSE 5000

CMD ["npm", "run", "dev"]