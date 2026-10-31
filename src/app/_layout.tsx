import { Color, DarkTheme, DefaultTheme, Redirect, Stack, ThemeProvider, useSegments } from "expo-router"
import { ClerkProvider, useAuth } from "@clerk/expo"
import { tokenCache } from "@clerk/expo/token-cache"
import "../../global.css"
import { useColorScheme } from "react-native"
import { KeyboardProvider } from "react-native-keyboard-controller"
import * as Sentry from '@sentry/react-native';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}


Sentry.init({
  dsn: process.env.EXPO_SENTRY_PUBLIC_DSN,

  sendDefaultPii: true,
  // Enable Logs
  enableLogs: false,
  integrations: [Sentry.feedbackIntegration()],

});


const RootLayout = () => {

  const colorScheme = useColorScheme()

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <KeyboardProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </KeyboardProvider>
      </ThemeProvider>
    </ClerkProvider>
  )
}

export default Sentry.wrap(RootLayout)
