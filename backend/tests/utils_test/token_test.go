package utils_test

import (
	"backend/internal/services/utils"
	"fmt"
	"github.com/google/uuid"
	"testing"
)

func TestGenerateJWTToken(t *testing.T) {

	// Тестові дані
	testID := uuid.New()
	testEmail := "test@example.com"

	// Викликаємо функцію
	token, err := utils.GenerateJWTToken(testEmail, testID)
	if err != nil {
		t.Fatalf("Error generating JWT token: %v", err)
	}

	// Лог для відладки
	t.Logf("Generated JWT token: %s", token)
	fmt.Printf("Generated JWT token: %s", token)
}
