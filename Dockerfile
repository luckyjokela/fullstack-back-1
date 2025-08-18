FROM node:18-alpine

WORKDIR /app

# 1. Копируем только файлы зависимостей
COPY package*.json ./
COPY pnpm-lock.yaml ./

# 2. Устанавливаем зависимости
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile && \
    pnpm rebuild @nestjs/core @swc/core bcrypt 

# 3. Копируем остальное
COPY src ./src
COPY nest-cli.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

# 4. Собираем
RUN pnpm build

EXPOSE 3001

CMD ["pnpm", "start:prod"]