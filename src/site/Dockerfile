FROM node:8-slim

COPY . /starter
COPY package.json /starter/package.json
COPY .env.production /starter/.env.production

WORKDIR /starter

ENV NODE_ENV production
RUN npm install --production

CMD ["npm","start"]

EXPOSE 8084
