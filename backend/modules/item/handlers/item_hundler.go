package handlers

import (
	"backend/internal/db/postgres"
	"backend/internal/entities"
	utils2 "backend/internal/services/utils"
	"backend/modules/item/models"
	"backend/modules/item/repository"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"strconv"
)

func CreateItemHandler(ctx *gin.Context) {
	db := postgres.DB
	userID, ok := utils2.GetUserIDFromContext(ctx)
	if !ok {
		return
	}

	var item models.Items
	if err := ctx.ShouldBindJSON(&item); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	item.OwnerID = userID

	newItem, err := repository.CreateItem(db, &item)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, newItem)
}

func GetItemByID(ctx *gin.Context) {
	db := postgres.DB
	itemId, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	user, ok := utils2.GetCurrentUserFromContext(ctx, db)
	if !ok {
		return
	}

	item, err := repository.GetItemById(db, itemId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if item.OwnerID != user.ID && !user.IsSuperUser {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied"})
		return
	}

	ctx.JSON(http.StatusOK, item)

}

func GetAvailableLanguages(ctx *gin.Context) {
	db := postgres.DB

	var langs []string
	err := db.Model(&models.Items{}).Distinct("language").Pluck("language", &langs).Error
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"languages": langs})
}

func GetAvailableCategories(ctx *gin.Context) {
	db := postgres.DB

	var categories []string
	err := db.Model(&models.Items{}).Distinct("category").Pluck("category", &categories).Error
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"categories": categories})
}

func UpdateItemByIdHandler(ctx *gin.Context) {
	db := postgres.DB
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	user, ok := utils2.GetCurrentUserFromContext(ctx, db)
	if !ok {
		return
	}

	var update models.ItemUpdate
	if err := ctx.ShouldBindJSON(&update); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	item, err := repository.UpdateItemById(db, id, &update)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if item.OwnerID != user.ID && !user.IsSuperUser {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied"})
		return
	}

	ctx.JSON(http.StatusOK, item)

}

func GetAllItemsHandler(ctx *gin.Context) {

	db := postgres.DB

	user, ok := utils2.GetCurrentUserFromContext(ctx, db)
	if !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	isSuperUser, _ := utils2.GetIsSuperUser(db, user.ID)

	language := ctx.DefaultQuery("language", "pl")
	skip, _ := strconv.Atoi(ctx.DefaultQuery("skip", "0"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "100"))

	params := &entities.Parameters{
		Language: language,
		Skip:     skip,
		Limit:    limit,
	}

	items, err := repository.GetAllItems(db, user.ID, isSuperUser, params)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, items)
}

func DeleteItemByIdHandler(ctx *gin.Context) {

	db := postgres.DB

	user, ok := utils2.GetCurrentUserFromContext(ctx, db)
	if !ok {
		return
	}

	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	item, err := repository.GetItemById(db, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if item.OwnerID != user.ID || !user.IsSuperUser {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied"})
		return
	}
	err = repository.DeleteItemById(db, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"success": "Item deleted"})
}
