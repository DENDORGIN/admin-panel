package main

import (
	"backend/internal/db/postgres"
	"backend/internal/middleware"
	"backend/modules/blog"
	"backend/modules/calendar"
	"backend/modules/item"
	"backend/modules/media"
	"backend/modules/property"
	"backend/modules/user"
	"backend/modules/user/handlers"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	_ "net/http/pprof"
	"os"
	"strings"
)

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		_ = fmt.Errorf("error loading .env file: %v", err)
	}
}

func main() {

	go func() {
		log.Println("Starting profiling server on :6060...")
		//http://localhost:6060/debug/pprof/
		log.Fatal(http.ListenAndServe(":6060", nil))
	}()

	postgres.InitAdminDB()

	port := os.Getenv("APP_RUN_PORT")
	fmt.Println(port)
	gin.SetMode(gin.ReleaseMode)

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(redirectFromWWW())
	r.Use(CustomCors())

	// Login limiter middleware
	r.Use(middleware.LoginLimiterMiddleware())

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Healthy",
		})
	})
	r.GET("/api/init", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Init",
		})
	})

	//Auth
	r.POST("/v1/login/access-token", handlers.LoginHandler)

	// Password recovery
	r.POST("/v1/password-recovery/:email", handlers.RequestPasswordRecover)
	r.POST("/v1/reset-password/", handlers.ResetPassword)

	r.POST("/v1/init-tenant-migrations", func(c *gin.Context) {
		postgres.InitAdminDB()
		c.JSON(http.StatusOK, gin.H{"message": "Tenant DB migrated"})
	})

	//Users
	r.POST("/v1/users/signup", handlers.CreateUser)

	//Protecting routes with JWT middleware
	r.Use(middleware.AuthMiddleware())

	// Version routes
	version := r.Group("/v1")

	// User routes
	user.RegisterRoutes(version)

	// Blogs routes
	blog.RegisterRoutes(version)

	// Items routes
	item.RegisterRoutes(version)

	// Properties routes
	property.RegisterRoutes(version)

	// Calendar
	calendar.RegisterRoutes(version)

	// Download files
	media.RegisterRoutes(version)

	// Run the server
	if err := r.Run(port); err != nil {
		fmt.Println("Failed to run server", err)
		os.Exit(1)
	}
	log.Printf("Server started on port %s\n", port)

}

func redirectFromWWW() gin.HandlerFunc {
	return func(c *gin.Context) {
		if strings.HasPrefix(c.Request.Host, "www.") {
			newHost := "https://" + c.Request.Host[len("www."):]
			c.Redirect(http.StatusMovedPermanently, newHost+c.Request.URL.String())
			return
		}
		c.Next()
	}
}

func CustomCors() gin.HandlerFunc {
	appUrl := os.Getenv("APP_URL")

	config := cors.Config{
		AllowOrigins:     []string{appUrl},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60}

	return cors.New(config)
}
