package item

import (
	"backend/modules/item/handlers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup) {
	itemGroup := r.Group("/items")
	{
		itemGroup.POST("/", handlers.CreateItemHandler)
		itemGroup.GET("/", handlers.GetAllItemsHandler)
		itemGroup.GET("/:id", handlers.GetItemByID)
		itemGroup.PATCH("/:id", handlers.UpdateItemByIdHandler)
		itemGroup.GET("/languages", handlers.GetAvailableLanguages)
		itemGroup.GET("/categories", handlers.GetAvailableCategories)
		itemGroup.DELETE("/:id", handlers.DeleteItemByIdHandler)
	}
}
