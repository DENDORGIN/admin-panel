package models

import "github.com/google/uuid"

type PropertyGet struct {
	ID        uuid.UUID `json:"ID"`
	Height    string    `json:"height"`
	Width     string    `json:"width"`
	Weight    string    `json:"weight"`
	Color     string    `json:"color"`
	Material  string    `json:"material"`
	Brand     string    `json:"brand"`
	Size      string    `json:"size"`
	Motif     string    `json:"motif"`
	Style     string    `json:"style"`
	ContentID uuid.UUID `json:"content_id"`
}

type PropertyUpdate struct {
	Height   string `json:"height"`
	Width    string `json:"width"`
	Weight   string `json:"weight"`
	Color    string `json:"color"`
	Material string `json:"material"`
	Brand    string `json:"brand"`
	Size     string `json:"size"`
	Motif    string `json:"motif"`
	Style    string `json:"style"`
}
