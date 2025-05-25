package repository

import (
	"backend/internal/repository"
	"backend/modules/calendar/models"
	"errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"log"
	"time"
)

func CreateEvent(db *gorm.DB, c *models.Calendar) (*models.CalendarEvent, error) {
	if c.Title == "" {
		return nil, errors.New("the event name cannot be empty")
	}
	if c.StartDate.After(c.EndDate) {
		return nil, errors.New("the start date cannot be after the end date")
	}
	// Завантажуємо часовий пояс Варшави
	warsawLoc, err := time.LoadLocation("Europe/Warsaw")
	if err != nil {
		log.Fatal(err)
	}

	// Гарантуємо, що час завжди в UTC
	c.ID = uuid.New()
	c.StartDate = c.StartDate.In(warsawLoc)
	c.EndDate = c.EndDate.In(warsawLoc)

	reminderTime := c.StartDate.Add(-time.Duration(c.ReminderOffset) * time.Minute).In(warsawLoc)

	log.Printf("📌 The event '%s' reminds us of %s ", c.Title, reminderTime)

	if err := db.Create(c).Error; err != nil {
		return nil, err
	}

	return &models.CalendarEvent{
		ID:             c.ID,
		Title:          c.Title,
		Description:    c.Description,
		StartDate:      c.StartDate.In(warsawLoc),
		EndDate:        c.EndDate.In(warsawLoc),
		AllDay:         c.AllDay,
		ReminderOffset: c.ReminderOffset,
		Color:          c.Color,
		WorkingDay:     c.WorkingDay,
		SickDay:        c.SickDay,
		Vacation:       c.Vacation,
		Weekend:        c.Weekend,
		SendMail:       c.SendEmail,
		ReminderSent:   c.ReminderSent,
		UserID:         c.UserID,
	}, nil
}

func GetAllEvents(db *gorm.DB, userId uuid.UUID) ([]models.CalendarEvent, error) {
	var events []models.Calendar
	var response []models.CalendarEvent

	err := db.Where("user_id =?", userId).Find(&events).Error
	if err != nil {
		return nil, err
	}

	if len(events) == 0 {
		return []models.CalendarEvent{}, nil
	}
	warsawLoc, err := time.LoadLocation("Europe/Warsaw")
	if err != nil {
		log.Fatal(err)
	}

	for _, event := range events {
		response = append(response, models.CalendarEvent{
			ID:             event.ID,
			Title:          event.Title,
			Description:    event.Description,
			StartDate:      event.StartDate.In(warsawLoc),
			EndDate:        event.EndDate.In(warsawLoc),
			ReminderOffset: event.ReminderOffset,
			AllDay:         event.AllDay,
			Color:          event.Color,
			WorkingDay:     event.WorkingDay,
			SickDay:        event.SickDay,
			Vacation:       event.Vacation,
			Weekend:        event.Weekend,
			SendMail:       event.SendEmail,
			ReminderSent:   event.ReminderSent,
			UserID:         event.UserID,
		})
	}
	return response, nil
}

func GetEventById(db *gorm.DB, eventId uuid.UUID) (*models.CalendarEvent, error) {
	var calendar models.Calendar

	err := repository.GetByID(db, eventId, &calendar)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("event not found")
		}
		return nil, err
	}
	return &models.CalendarEvent{
		ID:             calendar.ID,
		Title:          calendar.Title,
		Description:    calendar.Description,
		StartDate:      calendar.StartDate.UTC(),
		EndDate:        calendar.EndDate.UTC(),
		ReminderOffset: calendar.ReminderOffset,
		AllDay:         calendar.AllDay,
		Color:          calendar.Color,
		WorkingDay:     calendar.WorkingDay,
		SickDay:        calendar.SickDay,
		Vacation:       calendar.Vacation,
		Weekend:        calendar.Weekend,
		SendMail:       calendar.SendEmail,
		ReminderSent:   calendar.ReminderSent,
		UserID:         calendar.UserID,
	}, nil
}

func CalendarUpdateEvent(db *gorm.DB, eventId uuid.UUID, eventUpdate *models.CalendarEventUpdate) (*models.CalendarEvent, error) {
	var event models.Calendar

	err := repository.GetByID(db, eventId, &event)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("event not found")
		}
		return nil, err
	}

	if eventUpdate.Title != "" {
		event.Title = eventUpdate.Title
	}
	if eventUpdate.Description != "" {
		event.Description = eventUpdate.Description
	}
	if !eventUpdate.StartDate.IsZero() {
		event.StartDate = eventUpdate.StartDate
	}
	if !eventUpdate.EndDate.IsZero() {
		event.EndDate = eventUpdate.EndDate
	}
	if eventUpdate.ReminderOffset != 0 {
		event.ReminderOffset = eventUpdate.ReminderOffset
	}
	if eventUpdate.AllDay {
		event.AllDay = eventUpdate.AllDay
	}
	if eventUpdate.Color != "" {
		event.Color = eventUpdate.Color
	}
	if eventUpdate.WorkingDay {
		event.WorkingDay = eventUpdate.WorkingDay
	}
	if eventUpdate.SickDay {
		event.SickDay = eventUpdate.SickDay
	}
	if eventUpdate.Vacation {
		event.Vacation = eventUpdate.Vacation
	}
	if eventUpdate.Weekend {
		event.Weekend = eventUpdate.Weekend
	}

	err = db.Save(&event).Error
	if err != nil {
		return nil, err
	}
	warsawLoc, err := time.LoadLocation("Europe/Warsaw")
	if err != nil {
		log.Fatal(err)
	}
	return &models.CalendarEvent{
		ID:             event.ID,
		Title:          event.Title,
		Description:    event.Description,
		StartDate:      event.StartDate.In(warsawLoc),
		EndDate:        event.EndDate.In(warsawLoc),
		ReminderOffset: event.ReminderOffset,
		AllDay:         event.AllDay,
		Color:          event.Color,
		WorkingDay:     event.WorkingDay,
		SickDay:        event.SickDay,
		Vacation:       event.Vacation,
		Weekend:        event.Weekend,
		SendMail:       event.SendEmail,
		ReminderSent:   event.ReminderSent,
		UserID:         event.UserID,
	}, nil
}

func DeleteEventById(db *gorm.DB, eventId uuid.UUID) error {
	err := repository.DeleteByID(db, eventId, &models.Calendar{})
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("event not found")
		}
		return err
	}
	return nil
}
