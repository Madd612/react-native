import { useSSO } from "@clerk/expo"
import { router } from "expo-router"
import { useState } from "react"
import { Alert } from "react-native"

export type SocialAuthStrategyOAuth = 'oauth_google' | 'oauth_apple'

const useSocialAuth = () => {

  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null)
  const { startSSOFlow } = useSSO()

  const handleSocialAuth = async (strategy: SocialAuthStrategyOAuth) => {

    if (loadingStrategy) return // Prevent multiple simultaneous sign-in attempts
    setLoadingStrategy(strategy)

    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy })

      if (!createdSessionId || !setActive) {
        Alert.alert('Sign In Incomplete', 'The sign-in process was not completed. Please try again.')
        return
      }
      
      await setActive({ session: createdSessionId })
      router.replace('/(home)')
       
    } catch (error:any) {

      console.error('Error during social authentication:', error)
      Alert.alert('Sign In Error', 'An error occurred during social sign-in. Please try again.')

    } finally {
      setLoadingStrategy(null)
    }
  }

  return { handleSocialAuth, loadingStrategy }
}


export default useSocialAuth
