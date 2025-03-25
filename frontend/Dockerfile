FROM node:22-alpine AS build
WORKDIR /app

# Install yarn and Quasar CLI
RUN apk add --no-cache yarn && \
    yarn global add @quasar/cli

# Copy package files
COPY frontend/package.json frontend/yarn.lock ./
COPY frontend/quasar.config.js ./
COPY frontend/.quasar ./.quasar

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY frontend/ .

# Build the app
RUN yarn build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/spa /usr/share/nginx/html
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 