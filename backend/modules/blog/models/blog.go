package models

import (
	"backend/modules/user/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type Blog struct {
	ID        uuid.UUID   `gorm:"type:uuid;primaryKey" json:"id"`
	Title     string      `gorm:"not null" json:"title"`
	Content   string      `gorm:"not null" json:"content"`
	Position  int         `gorm:"not null" json:"position"`
	Language  string      `gorm:"not null" json:"language"`
	Status    bool        `gorm:"default:false" json:"status"`
	OwnerID   uuid.UUID   `gorm:"not null;index" json:"-"`
	User      models.User `gorm:"foreignKey:OwnerID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"user"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (blog *Blog) BeforeCreate(*gorm.DB) error {
	blog.ID = uuid.New()
	return nil
}
