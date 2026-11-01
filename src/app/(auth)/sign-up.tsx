import { useSignUp } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SignUpScreen() {
  const { signUp, fetchStatus } = useSignUp()
  const router = useRouter()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [isVerificationStep, setIsVerificationStep] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isLoading = fetchStatus === 'fetching'

  const handleSignUp = async () => {
    setErrorMessage(null)

    try {
      const { error } = await signUp.password({
        emailAddress: emailAddress.trim(),
        password,
      })

      if (error) {
        setErrorMessage(error.message)
        return
      }

      await signUp.verifications.sendEmailCode()
      setIsVerificationStep(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create account'
      setErrorMessage(message)
    }
  }

  const handleVerifyEmail = async () => {
    setErrorMessage(null)

    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code })

      if (error) {
        setErrorMessage(error.message)
        return
      }

      if (signUp.status === 'complete') {
        await signUp.finalize()
        router.replace('/')
        return
      }

      setErrorMessage('More information is required to finish signing up.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to verify email'
      setErrorMessage(message)
    }
  }

  return (
    <SafeAreaView className="flex-1 justify-center bg-secondary px-6">
      <View className="rounded-t-[30px] bg-card p-6">
        <Text className="text-center text-4xl font-extrabold uppercase text-primary">
          Create account
        </Text>
        <Text className="mt-2 text-center text-secondary-foreground">
          {isVerificationStep
            ? `Enter the verification code sent to ${emailAddress}.`
            : 'Create your personalized grocery list.'}
        </Text>

        {!isVerificationStep ? (
          <>
            <TextInput
              value={emailAddress}
              onChangeText={setEmailAddress}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="Email address"
              placeholderTextColor="#8aa397"
              className="mt-6 rounded-2xl border border-border bg-muted px-4 py-3 text-base text-foreground"
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoComplete="new-password"
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="#8aa397"
              className="mt-3 rounded-2xl border border-border bg-muted px-4 py-3 text-base text-foreground"
            />
          </>
        ) : (
          <TextInput
            value={code}
            onChangeText={setCode}
            autoCapitalize="none"
            keyboardType="number-pad"
            placeholder="Verification code"
            placeholderTextColor="#8aa397"
            className="mt-6 rounded-2xl border border-border bg-muted px-4 py-3 text-base text-foreground"
          />
        )}

        {errorMessage ? (
          <Text className="mt-3 text-center text-sm text-destructive bg-white/60 p-2">{errorMessage}</Text>
        ) : null}

        <Pressable
          onPress={isVerificationStep ? handleVerifyEmail : handleSignUp}
          disabled={isLoading || (isVerificationStep ? !code : !emailAddress.trim() || !password)}
          className={`mt-5 items-center rounded-2xl py-3 ${isLoading ? 'bg-muted' : 'bg-primary'}`}
        >
          <Text className="font-semibold text-primary-foreground">
            {isLoading ? 'Please wait...' : isVerificationStep ? 'Verify email' : 'Create account'}
          </Text>
        </Pressable>

        <Text className="mt-5 text-center text-sm text-secondary-foreground">
          Already have an account?{' '}
          <Link href="/(auth)/sign-in" className="font-semibold text-primary">
            Sign in
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  )
}
