import { useAuth, useSignUp } from '@clerk/expo'
import { Redirect, router } from 'expo-router'
import { useState } from 'react'
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function MainScreen() {
  const { isLoaded, isSignedIn } = useAuth()
  const { signUp } = useSignUp()

  const [emailAddress, setEmailAddress] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSignUp = async () => {
    const { error } = await signUp.password({ emailAddress, password })
    if (error) {
      setError('Error during sign-up:' + error)
      // Handle the error in your app.
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      return
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode()
    if (sendError) {
      setError('Error sending verification code:' + sendError.message)
      // Handle the error in your app.
      return
    }

    setIsVerifying(true)
  }

  const handleVerify = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({ code })
    if (error) {
      setError('Error verifying email code:' + error.message)
      // Handle the error in your app.
      return
    }

    const { error: finalizeError } = await signUp.finalize()
    if (finalizeError) {
      setError('Error finalizing sign-up:' + finalizeError.message)
      // Handle the error in your app.
    }
  }

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return <Redirect href={'/(tabs)'} />
  }

  if (isVerifying) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter your verification code"
          onChangeText={setCode}
          keyboardType="numeric"
        />

        { error && <Text style={{ color: 'red' }}>{error}</Text>}

        <Button title="Verify" onPress={handleVerify} />
      </View>
    )
  }

  return (

    <SafeAreaView className='flex-1 justify-center items-center bg-secondary gap-8' edges={["top"]}>
      {/* Decorative elements */}
      <View className='absolute top-2 -left-10 w-56 h-56 bg-background/40 rounded-full' />
      <View className='absolute top-24 -right-16 w-72 h-72 bg-background/40 rounded-full' />

      <View className='flex px-6 w-full gap-7'>

        <View className='space-y-4 mt-5'>
          <Text className='text-center text-5xl tracking-tight text-primary-foreground uppercase dark:text-foreground font-extrabold'>Grocify</Text>
          <Text className='text-primary-foreground dark:text-foreground text-center'>Plan smatter. Shop happier.</Text>
        </View>

        <View className="rounded-3xl self-center mx-6 bg-white/10 backdrop:blur-md p-3 w-full border border-white/20">
          <Image source={require("@/assets/images/auth.png")} 
            className='w-full h-72 object-contain'
          />
        </View>
      </View>

      <View className='flex-1 gap-3 justify-center rounded-t-[30px] bg-card p-6 w-full'>

        <View className="bg-secondary-foreground self-center rounded-full px-4 py-1">
          <Text className='text-base font-semibold text-secondary uppercase'>Welcome</Text>
        </View>
        <Text className='text-center text-sm text-secondary-foreground'>Sign up to experience your personalized grocery.</Text>

        <View className="flex-col gap-3">
          <TextInput
            className="border border-border rounded-xl px-4 py-3 text-base text-secondary-foreground bg-input"
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            onChangeText={setEmailAddress}
            keyboardType="email-address"
          />

          <TextInput
            className="border border-border rounded-xl px-4 py-3 text-base text-secondary-foreground bg-input"
            value={password}
            placeholder="Enter password"
            secureTextEntry={true}
            onChangeText={setPassword}
          />

          <Text className="text-secondary-foreground">Already have an account?{' '}
            <Text className="text-primary-foreground" onPress={() => router.push('/(auth)/sign-in')}>Sign In</Text>
          </Text>

          {error ? <Text className="text-red-500">{error}</Text> : null}

          <Button title="Sign up" onPress={handleSignUp} />
          {/* Required for sign-up flows on Expo web. Clerk skips the browser CAPTCHA on iOS and Android */}
          <View nativeID="clerk-captcha" />
        </View>

        <Text className="mt-3 text-center text-sm leading-5 text-secondary-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>

    </SafeAreaView>

      
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
})