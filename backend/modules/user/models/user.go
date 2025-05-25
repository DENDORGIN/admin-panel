package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type User struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	FullName    string    `gorm:"not null" json:"fullName"`
	Avatar      string    `gorm:"default:null" json:"avatar"`
	Email       string    `gorm:"unique;not null" json:"email"`
	Password    string    `gorm:"not null" json:"password"`
	IsActive    bool      `gorm:"default:true" json:"isActive"`
	IsAdmin     bool      `gorm:"default:false" json:"isAdmin"`
	IsSuperUser bool      `gorm:"default:false" json:"isSuperUser"`
	Acronym     string    `gorm:"unique;default:null" json:"acronym"`

	LastSeenAt *time.Time `gorm:"default:null" json:"lastSeenAt,omitempty"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (user *User) BeforeCreate(*gorm.DB) error {
	if user.ID == uuid.Nil {
		user.ID = uuid.New()
	}
	return nil
}
