FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install && pnpm approve-builds

COPY src ./src
COPY nest-cli.json ./
COPY tsconfig.json ./
COPY eslint.config.mjs ./
COPY nest-cli.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN pnpm build

EXPOSE 3001

CMD ["pnpm", "start:prod"]