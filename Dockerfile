FROM node:18-alpine
    MAINTAINER Levente <leventea@tuta.io>

WORKDIR /backend
COPY ./ ./

RUN npm install -g pnpm
RUN pnpm i && pnpm run build
