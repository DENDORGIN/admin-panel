package media

import (
	"backend/modules/media/handlers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup) {
	mediaGroup := r.Group("/media")
	{
		mediaGroup.POST("/:postId/images", handlers.DownloadMediaHandler)
		mediaGroup.POST("/images", handlers.DownloadMediaOneImageHandler)
		mediaGroup.GET("/images/:postId", handlers.GetAllMediaByBlogIdHandler)
		mediaGroup.DELETE("/images/:postId", handlers.DeleteMediaHandler)
		mediaGroup.DELETE("/images/url", handlers.DeleteImageFromUrl)
	}
}
