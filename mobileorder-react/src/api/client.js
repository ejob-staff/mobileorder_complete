export const jsonHeaders = {
  'Content-Type': 'application/json',
}

export async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
  })

  if (!response.ok) {
    let message = '通信に失敗しました。'
    try {
      const body = await response.json()
      message = body.message || message
    } catch {
      message = `通信に失敗しました。status: ${response.status}`
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}
