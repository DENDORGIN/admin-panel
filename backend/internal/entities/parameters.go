package entities

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Parameters struct {
	Language string
	Skip     int
	Limit    int
}

type EmailConfig struct {
	SMTPHost string
	SMTPPort int
	Username string
	Password string
	From     string
}
