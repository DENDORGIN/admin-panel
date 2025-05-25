package repository

import (
	"backend/internal/entities"
	"backend/internal/repository"
	"backend/modules/item/models"
	mediaModel "backend/modules/media/models"
	"backend/modules/media/service"
	propModel "backend/modules/property/models"
	propRepo "backend/modules/property/repository"
	"errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func CreateItem(db *gorm.DB, i *models.Items) (*models.ItemsPost, error) {
	if i.Title == "" {
		return nil, errors.New("the product title cannot be empty")
	}
	err := repository.GetPosition(db, i.Position, &models.Items{})
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	// Якщо позиція існує, зсуваємо всі наступні
	if err == nil {
		if shiftErr := repository.ShiftPositions[models.Items](db, i.Position, i.Language); shiftErr != nil {
			return nil, shiftErr
		}
	}

	err = repository.CreateEssence(db, i)
	if err != nil {
		return nil, err
	}
	return &models.ItemsPost{
		ID:       i.ID,
		Title:    i.Title,
		Content:  i.Content,
		Price:    i.Price,
		Position: i.Position,
		Quantity: i.Quantity,
		Language: i.Language,
		ItemUrl:  i.ItemUrl,
		Category: i.Category,
		Status:   i.Status,
		OwnerID:  i.OwnerID,
	}, nil
}

func GetItemById(db *gorm.DB, itemId uuid.UUID) (*models.ItemGet, error) {
	var item models.Items
	var property propModel.Property
	var media []*mediaModel.Media

	// Get product
	err := repository.GetByID(db, itemId, &item)
	if err != nil {
		return nil, err
	}

	// Get property by product ID
	err = repository.GetAllContentByID(db, itemId, &property)
	if err != nil {
		return nil, err
	}

	//Get Media by product ID
	err = repository.GetAllMediaByID(db, itemId, &media)
	if err != nil {
		return nil, err
	}
	mediaMap := make(map[uuid.UUID][]string)
	for _, m := range media {
		mediaMap[m.ContentId] = append(mediaMap[m.ContentId], m.Url)
	}
	return &models.ItemGet{
		ID:       item.ID,
		Title:    item.Title,
		Content:  item.Content,
		Price:    item.Price,
		Quantity: item.Quantity,
		Position: item.Position,
		Language: item.Language,
		ItemUrl:  item.ItemUrl,
		Category: item.Category,
		Status:   item.Status,
		Property: propModel.PropertyGet{
			ID:        property.ID,
			Height:    property.Height,
			Weight:    property.Weight,
			Width:     property.Width,
			Color:     property.Color,
			Material:  property.Material,
			Brand:     property.Brand,
			Size:      property.Size,
			Motif:     property.Motif,
			Style:     property.Style,
			ContentID: property.ContentId,
		},
		OwnerID: item.OwnerID,
		Images:  mediaMap[item.ID],
	}, nil

}

func UpdateItemById(db *gorm.DB, itemId uuid.UUID, updateItem *models.ItemUpdate) (*models.ItemGet, error) {
	var item *models.Items

	err := repository.GetByID(db, itemId, &item)
	if err != nil {
		return nil, err
	}

	if updateItem.Position != nil && *updateItem.Position != item.Position {
		err = repository.ShiftPositions[models.Items](db, *updateItem.Position, item.Language)
		if err != nil {
			return nil, err
		}
		item.Position = *updateItem.Position
	}

	if updateItem.Title != nil {
		item.Title = *updateItem.Title
	}
	if updateItem.Content != nil {
		item.Content = *updateItem.Content
	}
	if updateItem.Price != nil {
		item.Price = *updateItem.Price
	}
	if updateItem.Quantity != nil {
		item.Quantity = *updateItem.Quantity
	}
	if updateItem.ItemUrl != nil {
		item.ItemUrl = *updateItem.ItemUrl
	}
	if updateItem.Category != nil {
		item.Category = *updateItem.Category
	}
	if updateItem.Language != nil {
		item.Language = *updateItem.Language
	}
	if updateItem.Status != nil {
		item.Status = *updateItem.Status
	}

	err = db.Save(&item).Error
	if err != nil {
		return nil, err
	}

	return GetItemById(db, itemId)
}

func DeleteItemById(db *gorm.DB, id uuid.UUID) error {
	var item models.Items
	var property propModel.Property
	var mediaList []mediaModel.Media

	err := repository.DeleteByID(db, id, &item)
	if err != nil {
		return err
	}

	// Delete property by content_id
	err = repository.DeleteContentByID(db, id, &property)
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
	// Delete media by content_id
	err = repository.DeleteContentByID(db, id, &mediaModel.Media{})
	if err != nil {
		return err
	}

	return nil
}

func GetAllItems(db *gorm.DB, userId uuid.UUID, isSuperUser bool, parameters *entities.Parameters) (*models.ItemGetAll, error) {
	if parameters == nil {
		parameters = &entities.Parameters{}
	}

	// Значення за замовчуванням
	if parameters.Language == "" {
		parameters.Language = "pl"
	}
	if parameters.Skip < 0 {
		parameters.Skip = 0
	}
	if parameters.Limit <= 0 {
		parameters.Limit = 100
	}

	var items []*models.Items
	var media []*mediaModel.Media

	response := &models.ItemGetAll{}

	// Формуємо базовий запит
	query := db

	// Якщо не суперюзер, додаємо фільтр за власником
	if !isSuperUser {
		query = query.Where("owner_id = ?", userId)
	}

	// Фільтр за мовою
	if parameters.Language != "" {
		query = query.Where("language = ?", parameters.Language)
	}

	// Пагінація
	query = query.Order("position ASC").Offset(parameters.Skip).Limit(parameters.Limit)

	// Виконання запиту
	err := query.Find(&items).Error
	if err != nil {
		return nil, err
	}

	// Отримуємо медіа
	var itemIDs []uuid.UUID
	for _, item := range items {
		itemIDs = append(itemIDs, item.ID)
	}

	if len(itemIDs) > 0 {
		err = db.Where("content_id IN (?)", itemIDs).Find(&media).Error
		if err != nil {
			return nil, err
		}
	}

	// Групуємо медіафайли
	mediaMap := make(map[uuid.UUID][]string)
	for _, m := range media {
		mediaMap[m.ContentId] = append(mediaMap[m.ContentId], m.Url)
	}

	// Отримуємо властивості
	propertyMap := make(map[uuid.UUID]propModel.PropertyGet)
	for _, item := range items {
		property, err := propRepo.GetPropertyByItemId(db, item.ID)
		if err != nil {
			return nil, err
		}
		if property != nil {
			propertyMap[item.ID] = *property
		}
	}

	// Формуємо відповідь
	for _, item := range items {
		response.Data = append(response.Data, &models.ItemGet{
			ID:       item.ID,
			Title:    item.Title,
			Content:  item.Content,
			Price:    item.Price,
			Quantity: item.Quantity,
			Position: item.Position,
			Language: item.Language,
			ItemUrl:  item.ItemUrl,
			Category: item.Category,
			Status:   item.Status,
			Property: propertyMap[item.ID],
			OwnerID:  item.OwnerID,
			Images:   mediaMap[item.ID],
		})
	}

	response.Count = len(items)
	return response, nil
}
