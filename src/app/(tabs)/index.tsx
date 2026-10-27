import { Show, useClerk, useUser } from '@clerk/expo'
import { Link } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

const index = () => {

  const { user } = useUser()
  const { signOut } = useClerk()

  return (
    <View className='flex-1 justify-center items-center gap-2'>
      <Text> Welcome !</Text>
      
      <Show when="signed-out">
        <Link href="/(auth)/sign-in">
          <Text>Sign In</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign Up</Text>
        </Link>
      </Show>

      <Show when="signed-in">
        <Text>{user?.emailAddresses[0].emailAddress} </Text>
      
        <Pressable 
          className='bg-blue-500 p-3 rounded-lg'
        onPress={()=>{
          signOut()
        }} >
          <Text>Sign Out</Text>
        </Pressable>
      </Show>

    </View>
  )
}

export default index
