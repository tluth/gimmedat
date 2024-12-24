import { msalInstance, tokenRequest } from '@/auth'

import type { CrudTypes, ODSError, PaginationParams, SearchParams } from '.'

export const getAccessToken = async () => {
    const token = await msalInstance.acquireTokenSilent(tokenRequest)

    return `${token.tokenType} ${token.accessToken}`
}

export const getApiBaseUrl = (origin: string, prefix: string) => {
    if (origin.indexOf('localhost') > -1)
        return `https://${prefix}.dev.designstudio.oasys-software.com`
    else {
        const urlParts = origin.split('://')
        return `${urlParts[0]}://${prefix}.${urlParts[1]}`
    }
}

const isODSError = <E>(maybeError: E | ODSError): maybeError is ODSError =>
    (maybeError as ODSError).status_code !== undefined &&
    (maybeError as ODSError).detail !== undefined

const isValidResponse = <R>(response: R | ODSError): response is R =>
    !isODSError(response)

export const fetcher = async <R = never, T = never>(
    url: string | URL,
    method: CrudTypes,
    body?: T,
    headers?: Record<string, string>
) => {
    const response: R | ODSError = await fetch(
        `${getApiBaseUrl(window.location.origin, 'api')}/${url}`,
        {
            method,
            headers: {
                'Content-Type': 'application/json',
                authorization: await getAccessToken(),
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        }
    ).then(r => r.json())

    if (isODSError(response)) {
        throw new Error(response.detail || 'Error occurred')
    } else if (isValidResponse(response)) {
        return response
    }

    throw new Error('Unexpected response type')
}
