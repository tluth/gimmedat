import { API, COGNITO_CLIENT_ID } from '@/constants'
import type { CrudTypes, APIError } from '.'


export const getApiBaseUrl = (origin: string, prefix: string) => {
    if (origin.indexOf('localhost') > -1)
        return `https://${prefix}.dev.designstudio.oasys-software.com`
    else {
        const urlParts = origin.split('://')
        return `${urlParts[0]}://${prefix}.${urlParts[1]}`
    }
}

const isAPIError = <E>(maybeError: E | APIError): maybeError is APIError =>
    (maybeError as APIError).status_code !== undefined &&
    (maybeError as APIError).detail !== undefined

const isValidResponse = <R>(response: R | APIError): response is R =>
    !isAPIError(response)

export const fetcher = async <R = never, T = never>(
    url: string | URL,
    method: CrudTypes,
    body?: T,
    headers?: Record<string, string>
) => {
    const lastUserKey = `CognitoIdentityServiceProvider.${COGNITO_CLIENT_ID}.LastAuthUser`
    const lastUser = localStorage.getItem(lastUserKey)
    const accessTokenKey = `CognitoIdentityServiceProvider.${COGNITO_CLIENT_ID}.${lastUser}.accessToken`
    const accessToken = localStorage.getItem(accessTokenKey)
    console.log(accessToken)
    const response: R | APIError = await fetch(
        `${API}/${url}`,
        {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        }
    ).then(r => r.json())

    if (isAPIError(response)) {
        throw new Error(response.detail || 'Error occurred')
    } else if (isValidResponse(response)) {
        return response
    }

    throw new Error('Unexpected response type')
}
