package property

import (
	"backend/modules/property/handlers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup) {
	propertyGroup := r.Group("/properties")
	{
		propertyGroup.POST("/", handlers.CreatePropertiesHandler)
		propertyGroup.GET("/:id", handlers.GetPropertyByIDHandler)
		propertyGroup.PATCH("/:id", handlers.UpdatePropertyHandler)
		//propertyGroup.GET("/", handlers.GetAllPropertiesHandler)
		propertyGroup.DELETE("/:id", handlers.DeletePropertyHandler)
	}
}
