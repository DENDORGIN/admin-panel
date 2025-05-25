package middleware

import (
	"backend/internal/db/postgres"
	entities2 "backend/internal/entities"
	"bytes"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"io"
	"net/http"
	"time"
)

func LoginLimiterMiddleware() gin.HandlerFunc {
	db := postgres.DB

	return func(c *gin.Context) {
		if c.Request.Method != http.MethodPost || c.FullPath() != "/v1/login/access-token" {
			c.Next()
			return
		}

		// Зчитуємо сире тіло запиту, бо ShouldBindJSON споживає його
		rawData, err := c.GetRawData()
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
			return
		}

		// Відновлюємо тіло запиту для наступного хендлера
		c.Request.Body = io.NopCloser(bytes.NewBuffer(rawData))

		// Парсимо JSON вручну
		var body entities2.LoginRequest
		if err := json.Unmarshal(rawData, &body); err != nil || body.Email == "" {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Email is not specified or the request body is incorrect"})
			return
		}

		ip := c.ClientIP()
		email := body.Email

		var attempt entities2.LoginAttempt
		result := db.Where("email = ? AND ip = ?", email, ip).First(&attempt)
		if result.Error != nil && result.Error != gorm.ErrRecordNotFound {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
			return
		}

		// Перевірка блокування
		if attempt.BannedUntil != nil && time.Now().Before(*attempt.BannedUntil) {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "Blocked until " + attempt.BannedUntil.Format("15:04:05"),
			})
			return
		}

		// Зберігаємо email для післяобробки
		c.Set("loginLimiter:email", email)
		c.Set("loginLimiter:ip", ip)

		c.Next()

		// Якщо статус OK — скидаємо спроби
		if c.Writer.Status() == http.StatusOK {
			db.Where("email = ? AND ip = ?", email, ip).Delete(&entities2.LoginAttempt{})
			return
		}

		// Інакше — інкремент
		attempt.Email = email
		attempt.IP = ip
		attempt.LastAttempt = time.Now()
		attempt.Attempts++

		switch {
		case attempt.Attempts >= 9:
			t := time.Now().AddDate(100, 0, 0)
			attempt.BannedUntil = &t
		case attempt.Attempts >= 6:
			t := time.Now().Add(10 * time.Minute)
			attempt.BannedUntil = &t
		case attempt.Attempts >= 3:
			t := time.Now().Add(5 * time.Minute)
			attempt.BannedUntil = &t
		}

		if result.RowsAffected == 0 {
			_ = db.Create(&attempt)
		} else {
			_ = db.Save(&attempt)
		}
	}
}
