package service

import (
	"backend/modules/calendar/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"log"
	"time"
)

func GetUpcomingReminders(db *gorm.DB) ([]models.Calendar, error) {
	var upcomingEvents []models.Calendar
	now := time.Now().UTC()

	//log.Printf("🕒 Локальний час сервера: %v", now)
	//log.Printf("🌍 UTC час сервера: %v", now.UTC())

	err := db.
		Where("start_date - (INTERVAL '1 minute' * reminder_offset) <= ? AND reminder_sent = false AND send_email = true", now).
		Find(&upcomingEvents).Error

	if err != nil {
		log.Printf("❌ Database query error: %v", err)
		return nil, err
	}

	log.Printf("📋 Found %d events for reminder", len(upcomingEvents))
	return upcomingEvents, nil
}

// MarkReminderSent Позначити подію як відправлену
func MarkReminderSent(db *gorm.DB, eventID uuid.UUID) error {
	return db.Model(&models.Calendar{}).
		Where("id = ?", eventID).
		Update("reminder_sent", true).Error
}
