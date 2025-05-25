# 1. Використовуємо офіційний образ Go для білду
FROM golang:1.24 AS builder

# 2. Встановлюємо робочу директорію
WORKDIR /app

# 3. Копіюємо файли проекту
COPY go.mod go.sum ./
RUN go mod tidy

COPY . .

# 4. Будуємо бінарний файл
RUN go build -o main ./main.go

# 5. Створюємо фінальний образ з Ubuntu
FROM ubuntu:22.04

# Додаємо пакет timezones в контейнер
RUN apt-get update && apt-get install -y --no-install-recommends tzdata ca-certificates

# Встановлюємо часовий пояс
ENV TZ=Europe/Warsaw

# 6. Встановлюємо робочу директорію
WORKDIR /app

# 7. Копіюємо зібраний бінарник
COPY --from=builder /app/main .

# 8. Копіюємо файл .env
COPY .env .env

# 9. Виставляємо порт
EXPOSE 5180

# 10. Запускаємо сервіс з .env змінними
#CMD ["sh", "-c", "export $(cat .env | xargs) && ./main"]
CMD ["./main"]