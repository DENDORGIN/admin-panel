package postgres

import (
	"fmt"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
	"time"
)

var (
	DB *gorm.DB
)

func Connect() error {
	// Завантаження .env файлу
	err := godotenv.Load(".env")
	if err != nil {
		return fmt.Errorf("error loading .env file database: %v", err)
	}

	//// Логування для перевірки змінних середовища
	//fmt.Println("POSTGRES_SERVER:", os.Getenv("POSTGRES_SERVER"))
	//fmt.Println("POSTGRES_USER:", os.Getenv("POSTGRES_USER"))
	//fmt.Println("POSTGRES_DB:", os.Getenv("POSTGRES_DB"))

	// Формування DSN рядка для підключення
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		os.Getenv("POSTGRES_SERVER"),
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_DB"),
		os.Getenv("POSTGRES_PORT"),
		os.Getenv("POSTGRES_SSLMODE"),
		os.Getenv("POSTGRES_TIMEZONE"),
	)

	// Підключення до бази даних
	d, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		PrepareStmt: true,
	})
	if err != nil {
		return fmt.Errorf("failed to connect to the database: %v", err)
	}

	// Перевірка пінгу
	sqlDB, err := d.DB()
	if err != nil {
		return fmt.Errorf("failed to get database instance: %v", err)
	}
	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(time.Hour)

	if err = sqlDB.Ping(); err != nil {
		return fmt.Errorf("database ping failed: %v", err)
	}

	DB = d
	log.Println("Database connected successfully")
	return nil
}

// GetDB повертає підключення до бази даних
func GetDB() *gorm.DB {
	if DB == nil {
		fmt.Println("Database is not connected. Call Connect() first.")
	}
	return DB
}
