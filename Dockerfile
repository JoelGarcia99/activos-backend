FROM node:current-alpine3.19


WORKDIR /app
COPY . .

RUN npm install

EXPOSE 8000
CMD ["npm", "run", "start:dev"]
