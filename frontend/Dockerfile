# 1. Використовуємо офіційний образ Node.js для білду
FROM node:20 AS build

# 2. Встановлюємо робочу директорію всередині контейнера
WORKDIR /app

# 3. Копіюємо package.json і package-lock.json, щоб кешувати залежності
COPY package.json package-lock.json ./

# 4. Встановлюємо залежності
RUN npm install --frozen-lockfile

# 5. Копіюємо весь код у контейнер
COPY . .

# 6. Створюємо білд
RUN npm run build

# --- Фаза продакшн-сервера ---
# 7. Використовуємо офіційний Nginx-образ для деплою
FROM nginx:latest

# 8. Встановлюємо робочу директорію
WORKDIR /usr/share/nginx/html

# 9. Видаляємо стандартні файли Nginx
RUN rm -rf ./*

# 10. Копіюємо білд із попереднього етапу
COPY --from=build /app/dist .

# 11. Копіюємо кастомний конфіг Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# 12. Відкриваємо порт 80 для HTTP-запитів
EXPOSE 80

# 13. Запускаємо Nginx
CMD ["nginx", "-g", "daemon off;"]
