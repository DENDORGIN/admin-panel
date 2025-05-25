package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Property struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Height    string    `gorm:"default:null" json:"height"`
	Width     string    `gorm:"default:null" json:"width"`
	Weight    string    `gorm:"default:null" json:"weight"`
	Color     string    `gorm:"default:null" json:"color"`
	Material  string    `gorm:"default:null" json:"material"`
	Brand     string    `gorm:"default:null" json:"brand"`
	Size      string    `gorm:"default:null" json:"size"`
	Motif     string    `gorm:"default:null" json:"motif"`
	Style     string    `gorm:"default:null" json:"style"`
	ContentId uuid.UUID `gorm:"type:uuid;" json:"content_id"`
}

func (property *Property) BeforeCreate(*gorm.DB) error {
	if property.ID != uuid.Nil {
		property.ID = uuid.New()
	}
	return nil
}
