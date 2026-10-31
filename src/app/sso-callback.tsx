import { useAuth } from '@clerk/expo'
import { Redirect } from 'expo-router'

export default function SSOCallbackScreen() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) return <Redirect href="/" />

  return (
    <Redirect href={"/(auth)/sign-in"} />
  )
}
