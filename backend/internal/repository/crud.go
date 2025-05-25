package repository

import (
	"errors"
	"fmt"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"reflect"
)

func CreateEssence[T any](db *gorm.DB, model *T) error {
	if idField := reflect.ValueOf(model).Elem().FieldByName("ID"); idField.IsValid() && idField.CanSet() {
		if idField.Interface() == uuid.Nil {
			idField.Set(reflect.ValueOf(uuid.New()))
		}
	}
	return db.Create(model).Error
}

func GetByID[T any](db *gorm.DB, id uuid.UUID, model *T) error {
	err := db.Where("id = ?", id).First(model).Error
	if err != nil {
		return err
	}
	return nil
}

func GetByUserID[T any](db *gorm.DB, id uuid.UUID, model *T) error {
	err := db.Where("user_id = ?", id).First(model).Error
	if err != nil {
		return err
	}
	return nil
}

func DeleteByUserID[T any](db *gorm.DB, id uuid.UUID, model *T) error {
	err := db.Where("user_id = ?", id).Delete(model).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil
	}
	return err
}

func GetAllByField[T any](db *gorm.DB, field string, value any, out *T) error {
	return db.Where(fmt.Sprintf("%s = ?", field), value).Find(out).Error
}

func GetPosition[T any](db *gorm.DB, position int, model *T) error {
	err := db.Where("position = ?", position).First(model).Error
	if err != nil {
		return err
	}
	return nil
}

func DeleteByID[T any](db *gorm.DB, id uuid.UUID, model *T) error {
	err := db.Where("id = ?", id).Delete(model).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil
	}
	return err
}
func GetAllMediaByID[T any](db *gorm.DB, id uuid.UUID, model *T) error {
	err := db.Where("content_id = ?", id).Find(model).Error
	if err != nil {
		return err
	}
	return nil
}

func GetAllContentByID[T any](db *gorm.DB, id uuid.UUID, model *T) error {
	err := db.Where("content_id = ?", id).First(model).Error
	if err != nil {
		return err
	}
	return nil
}

func DeleteContentByID[T any](db *gorm.DB, id uuid.UUID, model *T) error {
	err := db.Where("content_id = ?", id).Delete(model).Error
	if err != nil {
		return err
	}
	return nil
}

// ShiftPositions зміщує всі записи вперед, якщо нова позиція вже зайнята
func ShiftPositions[T any](db *gorm.DB, newPosition int, language string) error {
	var items []T

	// Вибираємо елементи з позицією >= newPosition та з конкретною мовою
	err := db.Where("position >= ? AND language = ?", newPosition, language).
		Order("position ASC").
		Find(&items).Error
	if err != nil {
		return fmt.Errorf("failed to fetch items: %v", err)
	}

	if len(items) == 0 {
		return nil
	}

	for i := range items {
		v := reflect.ValueOf(&items[i]).Elem()
		positionField := v.FieldByName("Position")

		if positionField.IsValid() && positionField.CanSet() {
			positionField.SetInt(positionField.Int() + 1)
		} else {
			return fmt.Errorf("model does not have a 'Position' field or it's not settable")
		}
	}

	// Оновлюємо позиції лише вибраних товарів конкретної мови
	for _, item := range items {
		if err := db.Save(&item).Error; err != nil {
			return fmt.Errorf("failed to update position: %v", err)
		}
	}

	return nil
}
