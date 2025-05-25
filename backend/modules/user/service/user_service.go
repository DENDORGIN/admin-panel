package service

import (
	"backend/modules/user/models"
	"backend/modules/user/repository"
	"backend/modules/user/utils"
	"errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func UpdateCurrentUserPassword(db *gorm.DB, id uuid.UUID, password *models.UpdatePassword) (string, error) {
	user, err := repository.GetUserByIdFull(db, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", errors.New("user not found")
		}
		return "", err
	}

	if !utils.ComparePasswords(password.CurrentPassword, user.Password) {
		return "", errors.New("current password is incorrect")
	}
	if password.CurrentPassword == password.NewPassword {
		return "", errors.New("new password cannot be the same as the current one")
	}

	hashedPassword, err := utils.HashPassword(password.NewPassword)
	if err != nil {
		return "", err
	}

	user.Password = hashedPassword

	if err = db.Save(&user).Error; err != nil {
		return "", err
	}

	return "update password successfully", nil
}

func ResetCurrentUserPassword(db *gorm.DB, email string, password string) (string, error) {
	user, err := repository.GetUserByEmail(db, email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", errors.New("user not found")
		}
		return "", err
	}

	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return "", err
	}

	user.Password = hashedPassword

	if err = db.Save(&user).Error; err != nil {
		return "", err
	}

	return "update password successfully", nil
}

func TransformUsers(users []*models.User) []*models.UserResponse {
	var userResponses []*models.UserResponse
	for _, user := range users {
		userResponse := &models.UserResponse{
			ID:          user.ID,
			FullName:    user.FullName,
			Acronym:     user.Acronym,
			Avatar:      user.Avatar,
			Email:       user.Email,
			IsActive:    user.IsActive,
			IsSuperUser: user.IsSuperUser,
			IsAdmin:     user.IsAdmin,
			LastSeenAt:  user.LastSeenAt,
		}
		userResponses = append(userResponses, userResponse)
	}
	return userResponses
}
