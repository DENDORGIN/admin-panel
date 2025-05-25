package reminder

import (
	"backend/modules/calendar/models"
	"backend/modules/calendar/service"
	"gorm.io/gorm"
	"log"
	"time"
)

func StartReminderJobs(db *gorm.DB, tenantDomain string) {
	go scheduleReminders(db, tenantDomain)
	log.Printf("✅ Reminder launched for %s!", tenantDomain)
}

func scheduleReminders(db *gorm.DB, tenantDomain string) {
	// Завантажуємо часовий пояс Варшави
	warsawLoc, err := time.LoadLocation("Europe/Warsaw")
	if err != nil {
		log.Fatal(err)
	}
	for {
		log.Printf("[🔁 %s] Checking events...", tenantDomain)

		time.Sleep(1 * time.Minute) // Перевіряємо кожну хвилину

		events, err := service.GetUpcomingReminders(db)
		if err != nil {
			log.Printf("[❌ %s] Error receiving events: %v", tenantDomain, err)
			continue
		}

		if len(events) == 0 {
			log.Printf("[✅ %s] No events to remind you.", tenantDomain)
			continue
		}

		for _, event := range events {
			reminderTime := event.StartDate.Add(-time.Duration(event.ReminderOffset) * time.Minute).In(warsawLoc)
			timeUntilReminder := time.Until(reminderTime)

			log.Printf("[📌 %s] Event '%s' should be reminded at %s (via %v)", tenantDomain, event.Title, reminderTime, timeUntilReminder)

			scheduleReminder(db, event, reminderTime)
		}
	}
}

func scheduleReminder(db *gorm.DB, event models.Calendar, reminderTime time.Time) {
	// Завантажуємо часовий пояс Варшави
	warsawLoc, err := time.LoadLocation("Europe/Warsaw")
	if err != nil {
		log.Fatal(err)
	}
	reminderTime = reminderTime.In(warsawLoc)
	timeUntilReminder := time.Until(reminderTime)

	log.Printf("🕒 The event '%s' is reminded by: %v (UTC)", event.Title, timeUntilReminder)

	if timeUntilReminder <= 0 {
		log.Printf("⚠️ Reminder time for event '%s' has expired! Execute immediately.", event.Title)
		go SendReminder(db, event)
		return
	}

	time.AfterFunc(timeUntilReminder, func() {
		SendReminder(db, event)
	})
}
