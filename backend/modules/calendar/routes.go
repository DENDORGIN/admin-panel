package calendar

import (
	"backend/modules/calendar/handlers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.RouterGroup) {
	calendarGroup := r.Group("/calendar")
	{
		calendarGroup.POST("/events", handlers.CreateEventHandler)
		calendarGroup.GET("/events", handlers.GetAllEventsHandler)
		calendarGroup.PATCH("/events/:id", handlers.UpdateCalendarEventHandler)
		calendarGroup.DELETE("/events/:id", handlers.DeleteCalendarEventHandler)
	}
}
