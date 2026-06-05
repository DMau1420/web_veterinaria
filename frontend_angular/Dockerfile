# Etapa 1: Compilación
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx ng build --configuration=production

# Etapa 2: Servidor de producción
FROM nginx:alpine
# COPIAR LA CONFIGURACIÓN PERSONALIZADA DE NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPIAR LOS ARCHIVOS DE ANGULAR
COPY --from=build /app/dist/web_veterinaria/browser/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
