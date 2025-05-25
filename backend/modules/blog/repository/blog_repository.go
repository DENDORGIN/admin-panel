package repository

import (
	"backend/internal/repository"
	"backend/modules/blog/models"
	mediaModel "backend/modules/media/models"
	"backend/modules/media/service"
	"errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func CreateBlog(db *gorm.DB, b *models.Blog) (*models.BlogPost, error) {
	if b.Title == "" {
		return nil, errors.New("the product title cannot be empty")
	}

	err := repository.GetPosition(db, b.Position, &models.Blog{})
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	// Якщо позиція існує, зсуваємо всі наступні
	if err == nil {
		if shiftErr := repository.ShiftPositions[models.Blog](db, b.Position, b.Language); shiftErr != nil {
			return nil, shiftErr
		}
	}

	err = repository.CreateEssence(db, b)
	if err != nil {
		return nil, err
	}
	return &models.BlogPost{
		ID:       b.ID,
		Title:    b.Title,
		Content:  b.Content,
		Position: b.Position,
		Language: b.Language,
		Status:   b.Status,
		OwnerID:  b.OwnerID,
	}, nil
}

func GetAllBlogs(db *gorm.DB, userId uuid.UUID, isSuperUser bool) (*models.BlogGetAll, error) {
	var blogs []*models.Blog
	var media []*mediaModel.Media
	response := &models.BlogGetAll{}

	// Формуємо базовий запит
	query := db.Model(&models.Blog{}).Order("position ASC")
	if !isSuperUser {
		query = query.Where("owner_id = ?", userId)
	}

	// Отримуємо блоги
	err := query.Find(&blogs).Error
	if err != nil {
		return nil, err
	}

	// Отримуємо пов'язані медіафайли
	var blogIDs []uuid.UUID
	for _, blog := range blogs {
		blogIDs = append(blogIDs, blog.ID)
	}

	if len(blogIDs) > 0 {
		err = db.Where("content_id IN (?)", blogIDs).Find(&media).Error
		if err != nil {
			return nil, err
		}
	}

	// Групуємо медіа
	mediaMap := make(map[uuid.UUID][]string)
	for _, m := range media {
		mediaMap[m.ContentId] = append(mediaMap[m.ContentId], m.Url)
	}

	// Формуємо відповідь
	for _, blog := range blogs {
		response.Data = append(response.Data, &models.BlogGet{
			ID:       blog.ID,
			Title:    blog.Title,
			Content:  blog.Content,
			Position: blog.Position,
			Status:   blog.Status,
			OwnerID:  blog.OwnerID,
			Images:   mediaMap[blog.ID],
		})
	}

	response.Count = len(blogs)
	return response, nil
}

func GetBlogById(db *gorm.DB, id uuid.UUID) (*models.BlogGet, error) {
	var blog models.Blog
	var media []*mediaModel.Media

	err := repository.GetByID(db, id, &blog)
	if err != nil {
		return nil, err
	}

	err = repository.GetAllMediaByID(db, id, &media)
	if err != nil {
		return nil, err
	}

	mediaMap := make(map[uuid.UUID][]string)
	for _, m := range media {
		mediaMap[m.ContentId] = append(mediaMap[m.ContentId], m.Url)
	}

	return &models.BlogGet{
		ID:       blog.ID,
		Title:    blog.Title,
		Content:  blog.Content,
		Position: blog.Position,
		Status:   blog.Status,
		OwnerID:  blog.OwnerID,
		Images:   mediaMap[blog.ID],
	}, nil
}

func UpdateBlogById(db *gorm.DB, id uuid.UUID, updateBlog *models.BlogUpdate) (*models.BlogGet, error) {
	var blog models.Blog

	// Знаходимо блог за ID
	err := repository.GetByID(db, id, &blog)
	if err != nil {
		return nil, err
	}

	// Якщо позиція змінилася - зсуваємо інші блоги
	if updateBlog.Position != blog.Position {
		err = repository.ShiftPositions[models.Blog](db, updateBlog.Position, blog.Language) // Передаємо тільки число
		if err != nil {
			return nil, err
		}
		blog.Position = updateBlog.Position
	}

	// Оновлюємо поля блогу
	if updateBlog.Title != "" {
		blog.Title = updateBlog.Title
	}
	if updateBlog.Content != "" {
		blog.Content = updateBlog.Content
	}

	blog.Status = updateBlog.Status

	// Зберігаємо оновлений блог
	err = db.Save(&blog).Error
	if err != nil {
		return nil, err
	}

	// Повертаємо оновлені дані блогу
	return GetBlogById(db, id)
}

func DeleteBlogById(db *gorm.DB, id uuid.UUID) error {
	var blog models.Blog
	var mediaList []mediaModel.Media

	err := repository.DeleteByID(db, id, &blog)
	if err != nil {
		return err
	}

	err = repository.GetAllMediaByID(db, id, &mediaList)
	if err != nil {
		return err
	}
	for _, media := range mediaList {
		err = service.DeleteImageInBucket(media.Url)
		if err != nil {
			return err
		}
	}

	err = repository.DeleteContentByID(db, id, &mediaModel.Media{})
	if err != nil {
		return err
	}

	return nil
}
