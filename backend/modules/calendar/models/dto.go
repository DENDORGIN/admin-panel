package models

import (
	"github.com/google/uuid"
	"time"
)

type CalendarEvent struct {
	ID             uuid.UUID
	Title          string    `json:"title"`
	Description    string    `json:"description"`
	StartDate      time.Time `json:"startDate"`
	EndDate        time.Time `json:"endDate"`
	ReminderOffset int       `json:"reminderOffset"`
	AllDay         bool      `json:"allDay"`
	Color          string    `json:"color"`
	WorkingDay     bool      `json:"workingDay"`
	SickDay        bool      `json:"sickDay"`
	Vacation       bool      `json:"vacation"`
	Weekend        bool      `json:"weekend"`
	SendMail       bool      `json:"sendEmail"`
	ReminderSent   bool      `json:"reminderSent"`
	UserID         uuid.UUID `json:"user_id"`
}

type CalendarEventUpdate struct {
	Title          string    `json:"title"`
	Description    string    `json:"description"`
	StartDate      time.Time `json:"startDate"`
	EndDate        time.Time `json:"endDate"`
	ReminderOffset int       `json:"reminderOffset"`
	AllDay         bool      `json:"allDay"`
	Color          string    `json:"color"`
	WorkingDay     bool      `json:"workingDay"`
	SickDay        bool      `json:"sickDay"`
	Vacation       bool      `json:"vacation"`
	Weekend        bool      `json:"weekend"`
	SendMail       bool      `json:"sendEmail"`
	ReminderSent   bool      `json:"reminderSent"`
}
