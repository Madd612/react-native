import React, { ReactNode, useState } from 'react';
import { Alert, TextInput, View, Text, Pressable, Image } from 'react-native';
import { useSignIn } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';
import useSocialAuth, { SocialAuthStrategyOAuth } from '@/hooks/useSocialAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';

const googleIcon = require('@/assets/images/google.png')

const SocialAuthButton = ({ onPress, children, isLoading }: { 
   onPress: () => void, children: ReactNode, isLoading: boolean 
}) => {

  return (
    <View className="mt-4">
      <Pressable
        className={`h-14 flex-row items-center rounded-2xl border border-border bg-card-foreground px-4 active:opacity-90 ${isLoading ? 'opacity-70' : ''}`}
        disabled={isLoading}
        onPress={onPress}
      >
        {children}
      </Pressable>
    </View>
  )
}

export default function SignInScreen() {

  const { handleSocialAuth, loadingStrategy } = useSocialAuth()
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isGoolgleClicked = loadingStrategy === 'oauth_google'
  const isAppleClicked = loadingStrategy === 'oauth_apple'

  const isLoading = isGoolgleClicked || isAppleClicked || fetchStatus === 'fetching'

  const handlePasswordSignIn = async () => {
    setErrorMessage(null)

    try {
      const { error } = await signIn.password({
        emailAddress: emailAddress.trim(),
        password,
      })

      if (error) {
        setErrorMessage(error.message)
        return
      }

      if (signIn.status === 'complete') {
        await signIn.finalize()
        router.replace('/')
        return
      }

      setErrorMessage('Additional verification is required for this account.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in'
      setErrorMessage(message)
    }
  }

  return (
    <SafeAreaView className='flex-1 justify-center items-center bg-secondary gap-8 pt-5' edges={["top"]}>
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
            className='w-full max-h-96  object-contain'
          />
        </View>
      </View>

      <View className='flex-1 gap-3 justify-center rounded-t-[30px] bg-card p-6 w-full'>

        <View className="bg-secondary-foreground self-center rounded-full px-4 py-1">
          <Text className='text-base font-semibold text-secondary uppercase'>Welcome Back</Text>
        </View>
        <Text className='text-center text-sm text-secondary-foreground'>Sign in and jump right into your personalized grocery experience.</Text>

        <View className="flex-col gap-1">
          <TextInput
            value={emailAddress}
            onChangeText={setEmailAddress}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="Email address"
            placeholderTextColor="#8aa397"
            className="mt-2 rounded-2xl border border-border bg-muted px-4 py-3 text-base text-foreground"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoComplete="password"
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#8aa397"
            className="mt-2 rounded-2xl border border-border bg-muted px-4 py-3 text-base text-foreground"
          />
          {errorMessage ? (
            <Text className="mt-2 text-center text-sm text-destructive">{errorMessage}</Text>
          ) : null}
          <Pressable
            onPress={handlePasswordSignIn}
            disabled={isLoading || !emailAddress.trim() || !password}
            className={`mt-3 items-center rounded-2xl py-3 ${isLoading || !emailAddress.trim() || !password ? 'bg-muted' : 'bg-primary'}`}
          >
            <Text className="font-semibold text-primary-foreground">
              {fetchStatus === 'fetching' ? 'Signing in...' : 'Sign in with email'}
            </Text>
          </Pressable>

          <SocialAuthButton 
            onPress={() => handleSocialAuth('oauth_google')}
            isLoading={isLoading}
          >
            <View className='h-8 w-8 rounded-full justify-center items-center bg-white'>
              <Image source={googleIcon} className="w-[20px] h-[20px]" />
            </View>
            <Text className='ml-3'>{
              isGoolgleClicked ? 'Connecting...' : 'Continue with Google'
            }</Text>

            <FontAwesome name="angle-right" size={18} color="#5f6e66" 
              className='absolute right-4'
            />
          </SocialAuthButton>
          <SocialAuthButton
            onPress={() => handleSocialAuth('oauth_apple')}
            isLoading={isLoading}
          >
            <View className='h-8 w-8 rounded-full justify-center items-center bg-white'>
              <FontAwesome6 name="apple" size={18} color="#111" />
            </View>
            <Text className='ml-3'>{
              isAppleClicked ? 'Connecting...' : 'Continue with Apple'
            }</Text>

            <FontAwesome name="angle-right" size={18} color="#5f6e66" 
              className='absolute right-4'
            />
          </SocialAuthButton>
        </View>

        <Text className="mt-3 text-center text-sm text-secondary-foreground">
          New to Grocify? <Link href="/(auth)/sign-up" className="font-semibold text-primary">Create an account</Link>
        </Text>
        <Text className="mt-3 text-center text-sm leading-5 text-secondary-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>

    </SafeAreaView>
  );
}
