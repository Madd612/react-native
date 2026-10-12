import { useAuth } from "@clerk/expo"
import { Redirect, Stack } from "expo-router"
import { HeaderTitle } from "expo-router/build/react-navigation"


const Layout = () => {

  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />
  }

  return (
    <Stack screenOptions={{ headerTitle: "Home" }} />
  )
}

export default Layout