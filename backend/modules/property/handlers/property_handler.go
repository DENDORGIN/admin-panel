package handlers

import (
	"backend/internal/db/postgres"
	"backend/modules/property/models"
	"backend/modules/property/repository"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"net/http"
)

func CreatePropertiesHandler(ctx *gin.Context) {
	db := postgres.DB

	var property models.Property
	if err := ctx.ShouldBindJSON(&property); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newProps, err := repository.CreateProperty(db, &property)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, newProps)
}

func GetPropertyByIDHandler(ctx *gin.Context) {
	db := postgres.DB
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid property ID"})
		return
	}

	property, err := repository.GetPropertyById(db, id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, property)
}

func UpdatePropertyHandler(ctx *gin.Context) {
	db := postgres.DB
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid property ID"})
		return
	}

	var update models.PropertyUpdate
	if err := ctx.ShouldBindJSON(&update); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedProperty, err := repository.UpdateProperty(db, id, &update)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Property not found"})
		return
	}

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, updatedProperty)
}

func DeletePropertyHandler(ctx *gin.Context) {
	db := postgres.DB
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid property ID"})
		return
	}

	err = repository.DeleteProperty(db, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Status(http.StatusOK)
}
