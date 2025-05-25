package models

import (
	"backend/modules/user/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type Items struct {
	ID        uuid.UUID   `gorm:"type:uuid;primaryKey" json:"id"`
	Title     string      `gorm:"not null" json:"title"`
	Content   string      `gorm:"not null" json:"content"`
	Price     float64     `gorm:"not null" json:"price"`
	Quantity  int         `gorm:"not null" json:"quantity"`
	Position  int         `gorm:"not null" json:"position"`
	Language  string      `gorm:"not null" json:"language"`
	ItemUrl   string      `gorm:"default:null" json:"item_url"`
	Category  string      `gorm:"default:null" json:"category"`
	Status    bool        `gorm:"default:false" json:"status"`
	OwnerID   uuid.UUID   `gorm:"not null;index" json:"-"`
	User      models.User `gorm:"foreignKey:OwnerID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"user"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (item *Items) BeforeCreate(*gorm.DB) error {
	if item.ID != uuid.Nil {
		item.ID = uuid.New()
	}
	return nil
}
