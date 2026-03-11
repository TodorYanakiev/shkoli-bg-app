# syntax=docker/dockerfile:1

FROM node:20-bullseye-slim AS build
WORKDIR /app

ARG SEO_ALLOW_CACHE_ON_SYNC_FAILURE=false
ARG SEO_PRERENDER_WORKERS=1
ARG SEO_PRERENDER_RETRIES=3
ARG SEO_ROUTE_READY_TIMEOUT_MS=30000

ENV SEO_ALLOW_CACHE_ON_SYNC_FAILURE=${SEO_ALLOW_CACHE_ON_SYNC_FAILURE}
ENV SEO_PRERENDER_WORKERS=${SEO_PRERENDER_WORKERS}
ENV SEO_PRERENDER_RETRIES=${SEO_PRERENDER_RETRIES}
ENV SEO_ROUTE_READY_TIMEOUT_MS=${SEO_ROUTE_READY_TIMEOUT_MS}

COPY package.json package-lock.json ./
RUN npm ci
RUN npx playwright install --with-deps chromium

COPY . .
RUN npm run build:seo

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
