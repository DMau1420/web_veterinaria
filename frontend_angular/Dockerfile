FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --configuration=production

# Etapa 2: Servidor de producción
FROM nginx:alpine

COPY --from=build /app/dist/web_veterinaria /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
