package service

import (
	"context"
	"fmt"
	"github.com/Backblaze/blazer/b2"
	"github.com/gin-gonic/gin"
	"mime/multipart"
	"os"
	"strings"
)

func UploadFile(ctx *gin.Context, fileHeader *multipart.FileHeader) (string, error) {
	accountID := os.Getenv("BACKBLAZE_ID")
	applicationKey := os.Getenv("BACKBLAZE_KEY")
	bucketName := os.Getenv("BUCKET_NAME_ITEMS")

	if accountID == "" || applicationKey == "" || bucketName == "" {
		return "", fmt.Errorf("backblaze credentials are not set")
	}
	// Відкриваємо файл
	file, err := fileHeader.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %v", err)
	}
	defer func(file multipart.File) {
		err = file.Close()
		if err != nil {

		}
	}(file)

	// Генеруємо унікальне ім'я файлу
	uniqueFileName := GenerateUniqueFileName(fileHeader.Filename)
	fmt.Println(uniqueFileName)
	// Створюємо клієнт Backblaze B2
	b2Client, err := b2.NewClient(context.Background(), accountID, applicationKey)
	if err != nil {
		return "", fmt.Errorf("failed to create B2 client: %v", err)
	}

	// Отримуємо бакет
	bucket, err := b2Client.Bucket(context.Background(), bucketName)
	if err != nil {
		return "", fmt.Errorf("failed to get bucket: %v", err)
	}

	// Завантажуємо файл у Backblaze B2
	obj := bucket.Object(uniqueFileName)
	w := obj.NewWriter(context.Background())
	if _, err := w.ReadFrom(file); err != nil {
		return "", fmt.Errorf("failed to upload file: %v", err)
	}
	if err := w.Close(); err != nil {
		return "", fmt.Errorf("failed to close writer: %v", err)
	}

	// Формуємо публічний URL
	publicURL := fmt.Sprintf("https://f003.backblazeb2.com/file/%s/%s", bucketName, uniqueFileName)

	return publicURL, nil

}

// DeleteFile видаляє файл з Backblaze B2
func DeleteFile(fileName string) error {
	accountID := os.Getenv("BACKBLAZE_ID")
	applicationKey := os.Getenv("BACKBLAZE_KEY")
	bucketName := os.Getenv("BUCKET_NAME_ITEMS")

	if accountID == "" || applicationKey == "" || bucketName == "" {
		return fmt.Errorf("backblaze credentials are not set")
	}

	// Створюємо клієнт Backblaze B2
	b2Client, err := b2.NewClient(context.Background(), accountID, applicationKey)
	if err != nil {
		return fmt.Errorf("failed to create B2 client: %v", err)
	}

	// Отримуємо бакет
	bucket, err := b2Client.Bucket(context.Background(), bucketName)
	if err != nil {
		return fmt.Errorf("failed to get bucket: %v", err)
	}

	// Отримуємо об'єкт
	obj := bucket.Object(fileName)
	if obj == nil {
		// Файл не існує, пропускаємо видалення
		fmt.Println("File not found, skipping deletion:", fileName)
		return nil
	}

	// Видаляємо об'єкт
	err = obj.Delete(context.Background())
	if err != nil {
		// Якщо помилка 404 (файл не знайдено) - ігноруємо її
		if strings.Contains(err.Error(), "404") {
			fmt.Println("File not found on delete request, skipping:", fileName)
			return nil
		}
		return fmt.Errorf("failed to delete file: %v", err)
	}

	return nil
}

func DeleteImageInBucket(url string) error {
	fileName := ExtractFileNameFromURL(url)
	fmt.Println("Deleting image", fileName)

	err := DeleteFile(fileName)
	if err != nil {
		return err
	}
	return nil
}
