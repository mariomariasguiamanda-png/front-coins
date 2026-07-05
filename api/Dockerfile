FROM node:22-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY . .
RUN npm ci
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main"]
