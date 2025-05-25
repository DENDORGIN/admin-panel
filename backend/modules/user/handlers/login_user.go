package handlers

import (
	"backend/internal/db/postgres"
	utils3 "backend/internal/services/utils"
	"backend/modules/user/models"
	"backend/modules/user/repository"
	utils2 "backend/modules/user/utils"
	"errors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"log"
	"net/http"
)

func LoginHandler(ctx *gin.Context) {
	db := postgres.DB
	var loginRequest = models.LoginRequest{}
	if err := ctx.ShouldBindJSON(&loginRequest); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid login request"})
		return
	}

	user, err := repository.GetUserByEmail(db, loginRequest.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !utils2.ComparePasswords(loginRequest.Password, user.Password) {
		log.Println("Password mismatch for user:", user.Email)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := utils3.GenerateJWTToken(user.Email, user.FullName, user.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"access_token": token, "token_type": "bearer"})
	log.Println("Login successful")
}
