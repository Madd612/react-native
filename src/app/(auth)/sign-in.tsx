import React, { useState } from 'react';
import { TextInput, Button, View, Text, StyleSheet, Pressable } from 'react-native';
import { useSignIn } from '@clerk/expo';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const { signIn } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSignInPress = async () => {
    try {
      // 1. Attempt to sign in with email and password
      const result = await signIn.password({
        emailAddress,
        password,
      });

      // 2. Check if the sign-in is fully complete
      if (!result.error) {
        await signIn.finalize();
        // The root layout observer will automatically push them to the home screen/tabs
      }
    } catch (err: any) {
      // Catch and display any errors (e.g., incorrect password)
      setError(err?.errors?.[0]?.message || 'An error occurred during sign-in.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
      />

      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button title="Sign In" onPress={onSignInPress} />

      <Text>Don't have an account? 
        <Pressable><Text style={styles.link} onPress={() => router.push('/(auth)/sign-up')}>Sign Up</Text></Pressable>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, gap: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 6 },
  errorText: { color: 'red', marginBottom: 12 },
  link: { color: 'blue', textDecorationLine: 'underline', marginLeft: 5 },
});