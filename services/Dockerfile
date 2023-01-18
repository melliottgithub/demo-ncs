FROM node:lts-buster-slim

WORKDIR /app
COPY . .
COPY package.json .
COPY yarn.lock .

ENV NODE_ENV=production
RUN node --version
RUN yarn install --frozen-lockfile --production

EXPOSE 4000

CMD ["node", "index.js"]