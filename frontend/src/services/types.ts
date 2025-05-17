export type CrudTypes = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type APIError = {
  status_code: number
  detail: string
  extra?: {
    error_code: string
  }
}
