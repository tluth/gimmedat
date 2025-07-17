export type CrudTypes = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type APIError = {
  status_code: number
  detail: string
  extra?: {
    error_code: string
  }
}

export type FileItem = {
  key: string
  name: string
  size: string
  last_modified: string
  type: string
}
