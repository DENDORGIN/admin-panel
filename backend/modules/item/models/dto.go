package models

import (
	"backend/modules/property/models"
	"github.com/google/uuid"
)

type ItemsPost struct {
	ID       uuid.UUID
	Title    string    `json:"title"`
	Content  string    `json:"content"`
	Price    float64   `json:"price"`
	Quantity int       `json:"quantity"`
	Position int       `json:"position"`
	Language string    `json:"language"`
	ItemUrl  string    `json:"item_url"`
	Category string    `json:"category"`
	Status   bool      `json:"status"`
	OwnerID  uuid.UUID `json:"owner_id"`
}

type ItemGet struct {
	ID       uuid.UUID
	Title    string             `json:"title"`
	Content  string             `json:"content"`
	Price    float64            `json:"price"`
	Quantity int                `json:"quantity"`
	Position int                `json:"position"`
	Language string             `json:"language"`
	ItemUrl  string             `json:"item_url"`
	Category string             `json:"category"`
	Status   bool               `json:"status"`
	Property models.PropertyGet `json:"property"`
	OwnerID  uuid.UUID          `json:"owner_id"`
	Images   []string           `json:"images"`
}

type ItemUpdate struct {
	Title    *string  `json:"title"`
	Content  *string  `json:"content"`
	Price    *float64 `json:"price"`
	Quantity *int     `json:"quantity"`
	Position *int     `json:"position"`
	ItemUrl  *string  `json:"item_url"`
	Category *string  `json:"category"`
	Language *string  `json:"language"`
	Status   *bool    `json:"status"`
}

type ItemGetAll struct {
	Data  []*ItemGet
	Count int
}
