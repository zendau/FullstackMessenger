FROM node:16
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g @nestjs/cli
RUN npm install --legacy-peer-deps --force
COPY . .

CMD [ "sh", "-c", "npm run build && npm run start:prod"]