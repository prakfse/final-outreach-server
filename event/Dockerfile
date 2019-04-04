FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6002

EXPOSE 27017

CMD ["npm", "start"]