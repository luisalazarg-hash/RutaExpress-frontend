const normalizeApiBaseUrl = (baseUrl = '') => {
  if (!baseUrl) return ''
  const trimmed = baseUrl.replace(/\/+$/, '')
  return trimmed.endsWith('/api') ? trimmed.replace(/\/api$/, '') : trimmed
}

const API_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL)

export function createApiClient(instance, account) {
  async function getToken() {
    const scopes = [import.meta.env.VITE_AZURE_API_SCOPE].filter(Boolean)
    const tokenResponse = await instance.acquireTokenSilent({ scopes, account })
    return tokenResponse.accessToken
  }

  return async function request(path, options = {}) {
    const token = await getToken()
    const headers = new Headers(options.headers)
    headers.set('Authorization', `Bearer ${token}`)
    if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    const response = await fetch(`${API_URL}${normalizedPath}`, { ...options, headers })
    if (!response.ok) throw new Error(`La API respondió ${response.status}`)
    if (response.status === 204) return null
    return response.json()
  }
}