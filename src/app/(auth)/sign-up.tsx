import { useAuth, useSignUp } from '@clerk/expo'
import { Redirect, router } from 'expo-router'
import { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'

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
    return <Redirect href={'/(home)'} />
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

        <Text style={{ color: 'red' }}>{error}</Text>

        <Button title="Verify" onPress={handleVerify} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={setPassword}
      />

      <Text style={{ color: 'red' }}>{error}</Text>

      <Button title="Sign up" onPress={handleSignUp} />
      {/* Required for sign-up flows on Expo web. Clerk skips the browser CAPTCHA on iOS and Android */}
      <View nativeID="clerk-captcha" />

      <Text>Already have an account? <Text style={styles.link} onPress={() => router.push('/(auth)/sign-in')}>Sign In</Text></Text>
    </View>
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
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  }
})