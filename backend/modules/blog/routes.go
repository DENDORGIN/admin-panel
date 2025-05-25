package blog

import (
	"backend/modules/blog/handlers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup) {
	blogGroup := r.Group("/blog")
	{
		blogGroup.POST("/", handlers.CreateBlogHandler)
		blogGroup.GET("/", handlers.GetAllBlogsHandler)
		blogGroup.GET("/:id", handlers.GetBlogByIdHandler)
		blogGroup.PATCH("/:id", handlers.UpdateBlogByIdHandler)
		blogGroup.DELETE("/:id", handlers.DeleteBlogByIdHandler)
	}
}
