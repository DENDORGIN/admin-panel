package postgres

import (
	"backend/internal/entities"
	blog "backend/modules/blog/models"
	calendar "backend/modules/calendar/models"
	item "backend/modules/item/models"
	media "backend/modules/media/models"
	property "backend/modules/property/models"
	user "backend/modules/user/models"

	"fmt"
	"log"
)

func InitAdminDB() {
	var err error

	// Підключення до бази даних
	err = Connect()
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	log.Println("Successfully connected to the database")
	db := GetDB()

	// Виконання міграцій для таблиць
	err = db.AutoMigrate(
		&user.User{},
		&calendar.Calendar{},
		&blog.Blog{},
		&media.Media{},
		&item.Items{},
		&property.Property{}, &entities.LoginAttempt{})
	if err != nil {
		log.Fatalf("Failed to migrate: %v", err)
	}
	fmt.Println("Successfully migrated the database")
}
