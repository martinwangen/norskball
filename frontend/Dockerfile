FROM node:22-alpine AS build
WORKDIR /app

# Define build arguments
ARG VITE_API_BASE_URL
ARG VITE_API_TIMEOUT
ARG VITE_FOOTBALL_API_KEY
ARG VITE_GOOGLE_CLIENT_ID

# Install yarn and Quasar CLI
RUN apk add --no-cache yarn && \
    yarn global add @quasar/cli

# Copy all source files first
COPY frontend/ .

# Create .env file from build arguments
RUN echo "VITE_API_BASE_URL=$VITE_API_BASE_URL" > .env && \
    echo "VITE_API_TIMEOUT=$VITE_API_TIMEOUT" >> .env && \
    echo "VITE_FOOTBALL_API_KEY=$VITE_FOOTBALL_API_KEY" >> .env && \
    echo "VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID" >> .env

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