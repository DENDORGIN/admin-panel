package models

import (
	user "backend/modules/user/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type Calendar struct {
	ID             uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	Title          string    `gorm:"not null" json:"title"`
	Description    string    `gorm:"default:null" json:"description"`
	StartDate      time.Time `gorm:"not null" json:"startDate"`
	EndDate        time.Time `gorm:"not null" json:"endDate"`
	ReminderOffset int       `gorm:"default:0" json:"reminderOffset"`
	AllDay         bool      `gorm:"not null" json:"allDay"`
	Color          string    `gorm:"not null" json:"color"`
	WorkingDay     bool      `gorm:"default false" json:"workingDay"`
	SickDay        bool      `gorm:"default false" json:"sickDay"`
	Vacation       bool      `gorm:"default false" json:"vacation"`
	Weekend        bool      `gorm:"default false" json:"weekend"`
	SendEmail      bool      `gorm:"default false" json:"sendEmail"`
	ReminderSent   bool      `gorm:"default false" json:"reminderSent"`
	UserID         uuid.UUID `gorm:"not null;index" json:"-"`
	User           user.User `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE" json:"user"`
}

func (c *Calendar) BeforeCreate(*gorm.DB) error {
	c.ID = uuid.New()
	return nil
}
