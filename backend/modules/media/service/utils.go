package service

import (
	"fmt"
	"github.com/xyproto/randomstring"
	"net/url"
	"path"
	"path/filepath"
	"strings"
)

func GenerateUniqueFileName(originalName string) string {
	uniquePrefix := randomstring.CookieFriendlyString(7)   // Генеруємо унікальний префікс
	ext := filepath.Ext(originalName)                      // Отримуємо розширення файлу
	name := originalName[:len(originalName)-len(ext)]      // Видаляємо розширення
	return fmt.Sprintf("%s_%s%s", uniquePrefix, name, ext) // Формуємо нове ім'я
}

// ExtractFileNameFromURL витягує назву файлу з URL
func ExtractFileNameFromURL(fileURL string) string {
	parsedURL, err := url.Parse(fileURL)
	if err != nil {
		return ""
	}

	// Отримуємо останню частину шляху (ім'я файлу)
	fileName := path.Base(parsedURL.Path)

	// Видаляємо можливі GET-параметри після назви файлу
	fileName = strings.Split(fileName, "?")[0]

	return fileName
}
