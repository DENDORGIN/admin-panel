package handlers

import (
	"backend/internal/db/postgres"
	utils2 "backend/internal/services/utils"
	"backend/modules/user/models"
	"backend/modules/user/repository"
	"backend/modules/user/service"
	"github.com/gin-gonic/gin"
	"net/http"
)

func UpdatePasswordCurrentUser(ctx *gin.Context) {
	db := postgres.DB
	userID, ok := utils2.GetUserIDFromContext(ctx)
	if !ok {
		return
	}

	var updatePassword models.UpdatePassword
	if err := ctx.ShouldBindJSON(&updatePassword); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	message, err := service.UpdateCurrentUserPassword(db, userID, &updatePassword)
	if err != nil {
		if err.Error() == "user not found" {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": message})

}

func RequestPasswordRecover(ctx *gin.Context) {
	db := postgres.DB
	email := ctx.Param("email")

	// Перевірка чи існує користувач з таким email
	user, err := repository.GetUserByEmail(db, email)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Генерація токена для відновлення пароля
	resetToken, err := utils2.GenerateResetToken(user.Email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate reset token"})
		return
	}

	// Надсилання листа відновлення пароля
	if err := utils2.SendPasswordResetEmail(user.Email, resetToken); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send reset email"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Password reset email sent successfully"})
}

func ResetPassword(ctx *gin.Context) {
	db := postgres.DB
	var req models.ResetPasswordRequest

	// Отримуємо токен і новий пароль із тіла запиту
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if req.Token == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Token is required"})
		return
	}

	// Перевірка токена
	claims, err := utils2.VerifyResetToken(req.Token)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Зміна пароля
	_, err = service.ResetCurrentUserPassword(db, claims.Email, req.NewPassword)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Password reset successfully"})
}
