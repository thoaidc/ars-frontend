# ============================
# Stage 1: Build Angular app
# ============================
FROM node:18.20.5 AS build
WORKDIR /app

# Copy package files to cache
COPY package.json package-lock.json ./
RUN npm install

# Copy full src into container
COPY . .
RUN npm run build

# ============================
# Stage 2: Nginx serve
# ============================
FROM nginx:1.26.1

# Copy Nginx config files
ARG PROFILE=dev
ENV PROFILE=${PROFILE}
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-${PROFILE}.conf /etc/nginx/conf.d/default.conf

# Copy build output from previous stage
COPY --from=build /app/target /usr/share/nginx/html

# Expose port
ARG NGINX_PORT=80
ENV NGINX_PORT=${NGINX_PORT}
EXPOSE ${NGINX_PORT}

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
