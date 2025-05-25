package models

import "github.com/google/uuid"

type MediaPublic struct {
	ID        uuid.UUID `json:"id"`
	Url       string    `json:"url"`
	Type      string    `json:"type"`
	ContentID uuid.UUID `json:"content_id"`
}
