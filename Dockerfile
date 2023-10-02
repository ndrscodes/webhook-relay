FROM node:lts-alpine

RUN adduser -D relay && mkdir /app && chown relay /app
COPY package.json package-lock.json /app/
COPY index.js /app
COPY payloadConverter.js /app
WORKDIR /app
RUN npm install
USER relay

ENTRYPOINT [ "node", "index.js" ]