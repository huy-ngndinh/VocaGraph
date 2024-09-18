FROM node:20.10.0-alpine

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run docker

EXPOSE 4173

CMD ["npm", "run", "preview"]

