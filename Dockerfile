FROM node:18-alpine AS builder
    MAINTAINER Levente <leventea@tuta.io>

WORKDIR /build
COPY ./ ./

RUN npm install -g pnpm
RUN pnpm i && pnpm run build

FROM builder AS runner

WORKDIR /backend
COPY --from=builder /build/build /backend
COPY --from=builder /build/package.json /backend/package.json
COPY --from=builder /build/pnpm-lock.yaml /backend/pnpm-lock.yaml

RUN pnpm i --only=prod

ENTRYPOINT ["node", "index.js"]