FROM node:current-alpine3.19


WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000
CMD ["npm", "run", "start:dev"]
