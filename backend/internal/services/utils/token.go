package utils

import (
	"errors"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"os"
	"time"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET_KEY"))

type Claims struct {
	ID       uuid.UUID `json:"id"`
	Email    string    `json:"email"`
	FullName string    `json:"fullName"`
	jwt.RegisteredClaims
}

func GenerateJWTToken(email, fullName string, id uuid.UUID) (string, error) {
	claims := jwt.MapClaims{
		"id":       id.String(),
		"email":    email,
		"fullName": fullName,
		"exp":      time.Now().Add(time.Hour * 24 * 7).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func ParseJWTToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return jwtSecret, nil
	})
	if err != nil {
		return nil, err
	}
	// Перевірка валідності токена
	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("invalid token")
}

type ResetClaims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

func GenerateResetToken(email string) (string, error) {
	claims := &ResetClaims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)), // Токен дійсний 1 годину
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func VerifyResetToken(tokenString string) (*ResetClaims, error) {

	token, err := jwt.ParseWithClaims(tokenString, &ResetClaims{}, func(token *jwt.Token) (interface{}, error) {
		// Перевірка методу підпису
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	// Перевіряємо чи токен валідний і чи містить наші claims
	if claims, ok := token.Claims.(*ResetClaims); ok && token.Valid {
		// Перевіряємо чи токен не прострочений
		if claims.ExpiresAt.Time.Before(time.Now()) {
			return nil, errors.New("token has expired")
		}
		return claims, nil
	}

	return nil, errors.New("invalid token")
}
