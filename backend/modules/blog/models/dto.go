package models

import "github.com/google/uuid"

type BlogPost struct {
	ID       uuid.UUID
	Title    string    `json:"title"`
	Content  string    `json:"content"`
	Position int       `json:"position"`
	Language string    `json:"language"`
	Status   bool      `json:"status"`
	OwnerID  uuid.UUID `json:"owner_id"`
}

type BlogGet struct {
	ID       uuid.UUID
	Title    string    `json:"title"`
	Content  string    `json:"content"`
	Position int       `json:"position"`
	Language string    `json:"language"`
	Status   bool      `json:"status"`
	OwnerID  uuid.UUID `json:"owner_id"`
	Images   []string  `json:"images"`
}

type BlogUpdate struct {
	Title    string `json:"title"`
	Content  string `json:"content"`
	Position int    `json:"position"`
	Status   bool   `json:"status"`
}

type BlogGetAll struct {
	Data  []*BlogGet
	Count int
}
