package utils

import (
	"backend/internal/repository"
	"backend/modules/user/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"net/http"
)

const userKey = "currentUser"

// Отримати userID з контексту
func GetUserIDFromContext(ctx *gin.Context) (uuid.UUID, bool) {
	userIDRaw, exists := ctx.Get("id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return uuid.UUID{}, false
	}

	userID, ok := userIDRaw.(uuid.UUID)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
		return uuid.UUID{}, false
	}

	return userID, true
}

// Отримати користувача з контексту або БД з кешуванням
func GetCurrentUserFromContext(ctx *gin.Context, db *gorm.DB) (*models.User, bool) {
	// 1. Шукаємо в контексті
	if cached, ok := ctx.Get(userKey); ok {
		if user, valid := cached.(*models.User); valid {
			return user, true
		}
	}

	// 2. Отримуємо userID
	userID, ok := GetUserIDFromContext(ctx)
	if !ok {
		return nil, false
	}

	// 3. Отримуємо користувача з БД
	var user models.User
	if err := repository.GetByID(db, userID, &user); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot get user"})
		return nil, false
	}

	// 4. Кладемо у кеш
	ctx.Set(userKey, &user)

	return &user, true
}
func GetIsSuperUser(db *gorm.DB, id uuid.UUID) (bool, error) {
	var user models.User
	err := repository.GetByID(db, id, &user)
	if err != nil {
		return false, err
	}

	return user.IsSuperUser, nil
}
