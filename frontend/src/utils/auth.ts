import Cookies from "js-cookie"

export const getAccessToken = (): string | null => {
    return Cookies.get("access_token") || null
}

export const isLoggedIn = (): boolean => {
    return !!getAccessToken()
}
