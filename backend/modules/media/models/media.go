package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type Media struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	ContentId uuid.UUID `gorm:"type:uuid;" json:"content_id"`
	Url       string    `gorm:"type:string" json:"url"`
	Type      string    `gorm:"type:string" json:"type"`
	CreatedAt time.Time `gorm:"type:time" json:"created_at"`
}

func (media *Media) BeforeCreate(*gorm.DB) error {
	media.ID = uuid.New()
	return nil
}
