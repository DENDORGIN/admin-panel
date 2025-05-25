import type { CancelablePromise } from "./core/CancelablePromise"
import { OpenAPI } from "./core/OpenAPI"
import { request as __request } from "./core/request"

import {
  Body_login_login_access_token,
  CalendarEventCreate,
  CalendarEventPublic,
  ItemCreate,
  ItemPublic,
  ItemUpdate,
  ItemsPublic,
  Message,
  NewPassword,
  PostPublic,
  PostsPublic,
  Token,
  UpdatePassword,
  UserCreate,
  UserPublic,
  UserRegister,
  UserUpdate,
  UserUpdateMe,
  UsersPublic, Properties, UpdatePropertiesType
} from "./models"

export type TDataLoginAccessToken = {
  formData: Body_login_login_access_token
}
export type TDataRecoverPassword = {
  email: string
}
export type TDataResetPassword = {
  requestBody: NewPassword
}
export type TDataRecoverPasswordHtmlContent = {
  email: string
}

export class LoginService {
  /**
   * Login Access Token
   * OAuth2 compatible token login, get an access token for future requests
   * @returns Token Successful Response
   * @throws ApiError
   */
  public static loginAccessToken(
    data: TDataLoginAccessToken,
  ): CancelablePromise<Token> {
    const { formData } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/login/access-token",
      body: formData,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Test Token
   * Test access token
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static testToken(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/login/test-token",
    })
  }

  /**
   * Recover Password
   * Password Recovery
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static recoverPassword(
    data: TDataRecoverPassword,
  ): CancelablePromise<Message> {
    const { email } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/password-recovery/{email}",
      path: {
        email,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Reset Password
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static resetPassword(
    data: TDataResetPassword,
  ): CancelablePromise<Message> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/reset-password/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Recover Password Html Content
   * HTML Content for Password Recovery
   * @returns string Successful Response
   * @throws ApiError
   */
  public static recoverPasswordHtmlContent(
    data: TDataRecoverPasswordHtmlContent,
  ): CancelablePromise<string> {
    const { email } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/password-recovery-html-content/{email}",
      path: {
        email,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }
}

export type TDataReadUsers = {
  limit?: number
  skip?: number
}
export type TDataCreateUser = {
  requestBody: UserCreate
}
export type TDataUpdateUserMe = {
  requestBody: UserUpdateMe
}
export type TDataUpdatePasswordMe = {
  requestBody: UpdatePassword
}
export type TDataRegisterUser = {
  requestBody: UserRegister
}
export type TDataReadUserById = {
  userId: string
}
export type TDataUpdateUser = {
  requestBody: UserUpdate
  userId: string
}
export type TDataDeleteUser = {
  userId: string
}

export class UsersService {
  /**
   * Read Users
   * Retrieve users.
   * @returns UsersPublic Successful Response
   * @throws ApiError
   */
  public static readUsers(
    data: TDataReadUsers = {},
  ): CancelablePromise<UsersPublic> {
    const { limit = 100, skip = 0 } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/users/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Create User
   * Create new user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static createUser(
    data: TDataCreateUser,
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/users/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read User Me
   * Get current user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static readUserMe(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/users/me",
    })
  }

  /**
   * Delete User Me
   * Delete own user.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteUserMe(): CancelablePromise<Message> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/users/me",
    })
  }

  /**
   * Update User Me
   * Update own user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static updateUserMe(
    data: TDataUpdateUserMe,
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/users/me",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Update Password Me
   * Update own password.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static updatePasswordMe(
    data: TDataUpdatePasswordMe,
  ): CancelablePromise<Message> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/users/me/password",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Register User
   * Create new user without the need to be logged in.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static registerUser(
    data: TDataRegisterUser,
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/users/signup",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read User By Id
   * Get a specific user by id.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static readUserById(
    data: TDataReadUserById,
  ): CancelablePromise<UserPublic> {
    const { userId } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Update User
   * Update a user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static updateUser(
    data: TDataUpdateUser,
  ): CancelablePromise<UserPublic> {
    const { requestBody, userId } = data
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Delete User
   * Delete a user.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteUser(data: TDataDeleteUser): CancelablePromise<Message> {
    const { userId } = data
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/users/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }
}
export type TDataReadEmployeeById = {
  userId: string
}

export type TDataTestEmail = {
  emailTo: string
}


export class UtilsService {
  /**
   * Test Email
   * Test emails.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static testEmail(data: TDataTestEmail): CancelablePromise<Message> {
    const { emailTo } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/utils/test-email/",
      query: {
        email_to: emailTo,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Health Check
   * @returns boolean Successful Response
   * @throws ApiError
   */
  public static healthCheck(): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/utils/health-check/",
    })
  }
}

export type TDataReadItems = {
  limit?: number
  skip?: number
  language?: string
}
export type TDataCreateItem = {
  requestBody: ItemCreate
}
export type TDataUploadImages = {
  images: File[]
}
export type TDataReadItem = {
  id: string
}
export type TDataUpdateItem = {
  id: string
  requestBody: ItemUpdate
}
export type TDataDeleteItem = {
  id: string
}

export class ItemsService {
  /**
   * Read Items
   * Retrieve product.
   * @returns ItemsPublic Successful Response
   * @throws ApiError
   */
  public static readItems(
    data: TDataReadItems = {},
  ): CancelablePromise<ItemsPublic> {
    const { language = null, limit = 100, skip = 0 } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/items/",
      query: {
        language,
        skip,
        limit,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Create Item
   * Create new product.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static createItem(data: TDataCreateItem): CancelablePromise<ItemPublic> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/items/",
      body: data,
      headers: {
        "Content-Type": "application/json",
      }
      ,
    })
  }



  /**
   * Read Item
   * Get product by ID.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static readItemById(data: TDataReadItem): CancelablePromise<ItemPublic> {
    const { id } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/items/{id}",
      path: {
        id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Update Item
   * Update an product.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static updateItem(
      id: string,
      data: ItemUpdate,
  ): CancelablePromise<PostPublic> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: `/v1/items/${id}`,
      body: data,
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Delete Item
   * Delete an product.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteItem(data: TDataDeleteItem): CancelablePromise<Message> {
    const { id } = data
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/items/{id}",
      path: {
        id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  public static readItemsLanguages(): Promise<{ languages: string[] }> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/items/languages",
      errors: {
        422: "Validation Error",
      },
    })
  }
  public static readItemsCategories(): Promise<{ categories: string[] }> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/items/categories",
      errors: {
        422: "Validation Error",
      },
    })
  }

}

export type TDataCreateCalendarEvent = {
  requestBody: CalendarEventCreate
}

export type TDataReadCalendarEvents = {
  limit?: number
  skip?: number
}

export class CalendarEventsService {
  /**
   * Отримати події
   */
  public static readCalendarEvents(): CancelablePromise<CalendarEventPublic[]> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/calendar/events",
    })
  }

  /**
   * Створити подію
   */
  public static createCalendarEvent(
    data: CalendarEventCreate,
  ): CancelablePromise<CalendarEventPublic> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/calendar/events",
      body: data,
      mediaType: "application/json",
    })
  }

  /**
   * Видалити подію
   */
  public static deleteCalendarEvent(eventId: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: `/v1/calendar/events/${eventId}`,
    })
  }
}

export type TDataReadPost = {
  id: string
}
export type TDataReadPosts = {
  limit?: number
  skip?: number
}
export type TDataDeletePost = {
  id: string
}

export class BlogService {
  /**
   * Read Post
   * Retrieve Post.
   * @returns PostPublic Successful Response
   * @throws ApiError
   */
  public static readPosts(
    data: TDataReadPosts = {},
  ): CancelablePromise<PostsPublic> {
    const { limit = 100, skip = 0 } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/blog/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Create Item
   * Create new product.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static createPost(data: JSON): CancelablePromise<PostPublic> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/blog/",
      body: data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  }


/**
   * Read Item
   * Get product by ID.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static readPost(data: TDataReadPost): CancelablePromise<PostPublic> {
    const { id } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/v1/blog/{id}",
      path: {
        id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Update Item
   * Update an product.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static updatePost(
    id: string,
    data: JSON,
  ): CancelablePromise<PostPublic> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: `/v1/blog/${id}`,
      body: data,
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Delete Item
   * Delete an product.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deletePost(data: TDataDeletePost): CancelablePromise<Message> {
    const { id } = data
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/v1/blog/{id}",
      path: {
        id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }
}




export class MediaService {


  public static downloadImages(postId: string, data: FormData): Promise<{ url: string }[]> {
    return __request(OpenAPI, {
      method: "POST",
      url: `/v1/media/${postId}/images`,
      body: data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  }

  public static downloadOneImage(data: FormData): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: "POST",
      url: `/v1/media/images`,
      body: data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  }


  static deleteImage(postId: string, imageUrl: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: `/v1/media/images/${postId}`,
      body: JSON.stringify({ imageUrl }), // Передаємо URL як JSON
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static deleteImageInUrl(imageUrl: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: `/v1/media/images/url`,
      body: JSON.stringify({ imageUrl }), // Передаємо URL як JSON
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}


export class PropertyService {
  /**
   * Create Property
   * Create new Property.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static createProperty(data: JSON): CancelablePromise<Properties> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/v1/properties/",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }


  /**
   * Update Property
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static UpdateProperties(id: string, data: UpdatePropertiesType): CancelablePromise<Properties> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: `/v1/properties/${id}`,
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

