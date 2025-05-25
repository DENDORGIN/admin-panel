export type Body_login_login_access_token = {
  grant_type?: string | null
  email: string
  password: string
  scope?: string
  client_id?: string | null
  client_secret?: string | null
}

// export type HTTPValidationError = {
//   detail?: Array<ValidationError>
// }

export type ItemCreate = {
  title: string
  content: string
  price: number
  quantity: number
  position: number
  language: string
  item_url?: string | null
  category: string
  status: boolean
}

export type ItemPublic = {
  ID: string
  position: number
  title: string
  content: string
  images: string | null
  category: string
  property: Properties
  item_url: string
  language: string
  price: number
  quantity: number
  status: boolean
  owner_id: string
}

export type ItemUpdate = {
  title?: string
  content?: string
  price?: number
  quantity?: number
  position?: number
  item_url?: string | null
  category?: string
  language?: string
  status?: boolean
}

export type ItemsPublic = {
  Data: Array<ItemPublic>
  Count: number
}

export type PropertiesFormData = {
  height?: string
  width?: string
  weight?: string
  color?: string
  material?: string
  brand?: string
  motif?: string
  size?: string
  style?: string
  content_id: string
}

export type UpdatePropertiesType = {
  height?: string
  width?: string
  weight?: string
  color?: string
  material?: string
  brand?: string
  motif?: string
  size?: string
  style?: string
}

export type Properties = {
  ID: string;
  height: string;
  width: string;
  weight: string;
  color: string;
  material: string;
  brand: string;
  motif: string;
  size: string;
  style: string;
  content_id: string
}

export type PostPublic = {
  images: string | null
  title: string
  content: string
  status: boolean
  ID: string
  position: number
  owner_id: string
}

export type DownloadImage = {
  images: File[] | null
}

export type PostCreate = {
  position: number
  title: string
  content?: string | null
  images?: File[]
  status: boolean
}

export type PostUpdate = {
  title?: string
  content?: string
  images?: File[]
  position: number
  status: boolean
}

export type PostsPublic = {
  Data: Array<PostPublic>
  Count: number
}

export type Message = {
  message: string
}

export type NewPassword = {
  token: string
  newPassword: string
}

export type Token = {
  access_token: string
  token_type?: string
}

export type UpdatePassword = {
  currentPassword: string
  newPassword: string
}

export type UserCreate = {
  email: string
  isActive?: boolean
  isSuperUser?: boolean
  isAdmin?: boolean
  fullName?: string | null
  acronym?: string | null
  avatar?: string | null
  password: string
}

export type UserPublic = {
  ID: string
  email: string
  isActive?: boolean
  isSuperUser?: boolean
  isAdmin?: boolean
  fullName?: string | null
  acronym?: string | null
  avatar?: string | null
  lastSeenAt?: string | null

}

export type UserRegister = {
  email: string
  password: string
  fullName: string
}

export type UserUpdate = {
  email?: string | null
  isActive?: boolean
  isSuperUser?: boolean
  isAdmin?: boolean
  fullName?: string | null
  acronym?: string | null
  avatar?: string | null
  password?: string | null
}

export type UserUpdateMe = {
  fullName?: string | null
  email?: string | null
  avatar?: string | null
}

export type UsersPublic = {
  data: Array<UserPublic>
  count: number
}

export type ValidationError = {
  loc: Array<string | number>
  msg: string
  type: string
}

export type CalendarEventCreate = {
  title: string;
  startDate: string;
  endDate: string;
  reminderOffset?: number;
  allDay: boolean;
  description: string;
  color?: string | null;
  workingDay: boolean;
  sickDay: boolean;
  vacation: boolean;
  weekend: boolean;
  sendEmail: boolean;
}

export type CalendarEventPublic = {
  ID: string;
  title: string;
  startDate: string;
  endDate: string;
  reminderOffset?: number;
  allDay: boolean;
  description: string;
  color?: string | null;
  user_id: string;
  workingDay: boolean;
  sickDay: boolean;
  vacation: boolean;
  weekend: boolean;
  sendEmail: boolean;
}
