import { useAuth } from "@clerk/expo"
import { useEffect } from "react"

let tokenProvider: (() => Promise<string | null>) | null = null

export const setApiTokenProvider = (provider: () => Promise<string | null>) => {
  tokenProvider = provider
}

export const apiFetch = async (path: string, init?: RequestInit) => {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "")
  const url = baseUrl ? `${baseUrl}${path}` : path
  const token = tokenProvider ? await tokenProvider() : null
  const headers = new Headers(init?.headers)

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  return fetch(url, { ...init, headers })
}

export const ApiAuthBridge = () => {
  const { getToken } = useAuth()

  useEffect(() => {
    setApiTokenProvider(getToken)
  }, [getToken])

  return null
}
