package handlers

import (
	"backend/internal/db/postgres"
	utils2 "backend/internal/services/utils"
	"backend/modules/calendar/models"
	"backend/modules/calendar/repository"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
)

func CreateEventHandler(ctx *gin.Context) {
	db := postgres.DB
	userID, ok := utils2.GetUserIDFromContext(ctx)
	if !ok {
		return
	}

	var event models.Calendar
	if err := ctx.ShouldBindJSON(&event); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	event.UserID = userID

	newEvent, err := repository.CreateEvent(db, &event)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, newEvent)
}

func UpdateCalendarEventHandler(ctx *gin.Context) {

	db := postgres.DB
	userID, ok := utils2.GetUserIDFromContext(ctx)
	if !ok {
		return
	}

	eventIdStr := ctx.Param("id")
	if eventIdStr == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Event ID is required"})
		return
	}

	eventId, err := uuid.Parse(eventIdStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Event ID format"})
		return
	}
	var updateEvent models.CalendarEventUpdate
	if err = ctx.ShouldBindJSON(&updateEvent); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	event, err := repository.GetEventById(db, eventId)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}
	if event.UserID != userID {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to update this event"})
		return
	}

	updatedEvent, err := repository.CalendarUpdateEvent(db, eventId, &updateEvent)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, updatedEvent)

}

func GetAllEventsHandler(ctx *gin.Context) {
	db := postgres.DB
	userID, ok := utils2.GetUserIDFromContext(ctx)
	if !ok {
		return
	}

	events, err := repository.GetAllEvents(db, userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, events)
}

func DeleteCalendarEventHandler(ctx *gin.Context) {
	db := postgres.DB
	userID, ok := utils2.GetUserIDFromContext(ctx)
	if !ok {
		return
	}

	eventIdStr := ctx.Param("id")
	if eventIdStr == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Event ID is required"})
		return
	}

	eventId, err := uuid.Parse(eventIdStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Event ID format"})
		return
	}

	getEvent, err := repository.GetEventById(db, eventId)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}

	if getEvent.UserID != userID {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized to delete this event"})
		return
	}

	err = repository.DeleteEventById(db, eventId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Event deleted successfully"})

}
