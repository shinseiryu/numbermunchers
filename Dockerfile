# --- Build stage: install deps, build the React bundle, drop dev deps ---
FROM node:24-bookworm-slim AS build
WORKDIR /app

# Toolchain in case better-sqlite3 has no prebuilt binary for this platform
RUN apt-get update \
	&& apt-get install -y --no-install-recommends python3 make g++ \
	&& rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --omit=dev

# --- Runtime stage ---
FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production \
	DB_PATH=/data/numdb.sqlite

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/server ./server
COPY --from=build /app/public ./public
COPY --from=build /app/html ./html
COPY --from=build /app/src/assets ./src/assets

# SQLite database lives on a volume so accounts and scores survive upgrades
RUN mkdir -p /data && chown node:node /data
VOLUME /data
USER node

EXPOSE 3000
CMD ["node", "server/server.js"]
