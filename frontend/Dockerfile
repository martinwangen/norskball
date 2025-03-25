FROM node:22-alpine AS build
WORKDIR /app

# Install yarn and Quasar CLI
RUN apk add --no-cache yarn && \
    yarn global add @quasar/cli

# Copy all source files first
COPY frontend/ .

# Install dependencies
RUN yarn install --frozen-lockfile

# Build the app
RUN quasar build --no-verify

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/spa /usr/share/nginx/html
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Add cache control headers for index.html
RUN echo 'location = /index.html { add_header Cache-Control "no-cache, no-store, must-revalidate"; }' >> /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 