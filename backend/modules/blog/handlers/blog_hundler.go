package handlers

import (
	"backend/internal/db/postgres"
	utils2 "backend/internal/services/utils"
	"backend/modules/blog/models"
	"backend/modules/blog/repository"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
)

func CreateBlogHandler(ctx *gin.Context) {
	db := postgres.DB
	userID, ok := utils2.GetUserIDFromContext(ctx)
	if !ok {
		return
	}

	var blog models.Blog
	if err := ctx.ShouldBindJSON(&blog); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	blog.OwnerID = userID

	newBlog, err := repository.CreateBlog(db, &blog)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, newBlog)
}

func GetAllBlogsHandler(ctx *gin.Context) {

	db := postgres.DB

	user, ok := utils2.GetCurrentUserFromContext(ctx, db)
	if !ok {
		return
	}

	isSuperUser, _ := utils2.GetIsSuperUser(db, user.ID)

	blogs, err := repository.GetAllBlogs(db, user.ID, isSuperUser)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, blogs)
}

func GetBlogByIdHandler(ctx *gin.Context) {
	db := postgres.DB
	userID, ok := utils2.GetUserIDFromContext(ctx)
	if !ok {
		return
	}

	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid blog ID"})
		return
	}

	blog, err := repository.GetBlogById(db, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if blog.OwnerID != userID {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied"})
		return
	}

	ctx.JSON(http.StatusOK, blog)
}

func UpdateBlogByIdHandler(ctx *gin.Context) {
	db := postgres.DB

	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid blog ID"})
		return
	}

	user, ok := utils2.GetCurrentUserFromContext(ctx, db)
	if !ok {
		return
	}

	var update models.BlogUpdate
	if err := ctx.ShouldBindJSON(&update); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	blog, err := repository.UpdateBlogById(db, id, &update)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if blog.OwnerID != user.ID {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied"})
		return
	}

	ctx.JSON(http.StatusOK, blog)

}

func DeleteBlogByIdHandler(ctx *gin.Context) {

	db := postgres.DB
	user, ok := utils2.GetCurrentUserFromContext(ctx, db)
	if !ok {
		return
	}

	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid blog ID"})
		return
	}

	blog, err := repository.GetBlogById(db, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if blog.OwnerID != user.ID || !user.IsSuperUser {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Access denied"})
		return
	}
	err = repository.DeleteBlogById(db, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.Status(http.StatusOK)
}
