FROM node:22-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY . .
RUN ls -la /app && cat /app/package.json | head -5
RUN npm ci
RUN npm run build
RUN ls -la /app/dist || echo "DIST NAO EXISTE"

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main"]
