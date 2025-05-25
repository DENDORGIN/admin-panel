package models

import (
	//blog "backend/modules/blog/models"
	"github.com/google/uuid"
	"time"
)

type UserResponse struct {
	ID          uuid.UUID  `json:"ID"`
	FullName    string     `json:"fullName"`
	Avatar      string     `json:"avatar"`
	Email       string     `json:"email"`
	IsActive    bool       `json:"isActive"`
	IsSuperUser bool       `json:"isSuperUser"`
	IsAdmin     bool       `json:"isAdmin"`
	Acronym     string     `json:"acronym"`
	LastSeenAt  *time.Time `json:"lastSeenAt,omitempty"`
}

type AllUsers struct {
	Data  []*UserResponse `json:"data"`
	Count int             `json:"count"`
}

type UpdateUser struct {
	FullName string `json:"fullName,omitempty"`
	Email    string `json:"email,omitempty"`
	Avatar   string `json:"avatar"`
	Acronym  string `json:"acronym,omitempty"`
}

type UpdatePassword struct {
	CurrentPassword string `json:"currentPassword"`
	NewPassword     string `json:"newPassword"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token"`
	NewPassword string `json:"newPassword"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
