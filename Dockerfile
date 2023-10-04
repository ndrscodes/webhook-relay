FROM node:20.8.0-slim@sha256:c704ff2a5e27c3fc990418bf1f6c1b1ac6eb75471a7a2e2f192f401d211d2101

RUN mkdir /app && apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends dumb-init && apt-get autoremove && apt-get clean
COPY --chown=node:node package.json package-lock.json /app/
COPY --chown=node:node . /app/
WORKDIR /app/
RUN npm install --omit=dev
USER node
ENV NODE_ENV production

ENTRYPOINT [ "dumb-init", "node", "index.js" ]
