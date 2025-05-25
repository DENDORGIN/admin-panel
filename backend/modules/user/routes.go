package user

import (
	"backend/modules/user/handlers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup) {

	userGroup := r.Group("/users")
	{
		userGroup.GET("/me", handlers.ReadUserMe)
		userGroup.PATCH("/me", handlers.UpdateCurrentUser)
		userGroup.PATCH("/me/password/", handlers.UpdatePasswordCurrentUser)
		userGroup.GET("/", handlers.ReadAllUsers)
		userGroup.GET("/:id", handlers.ReadUserById)
		userGroup.POST("/", handlers.CreateUser)
		userGroup.DELETE("/:id", handlers.DeleteUser)
	}
}
