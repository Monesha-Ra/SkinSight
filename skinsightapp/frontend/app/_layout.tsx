import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
      <Stack.Screen name="signin" options={{headerShown:false,headerStyle: { backgroundColor: '#262526', },headerTintColor: 'white',headerTitleAlign:'center',headerTitle:'SIGN IN'}}/>
      <Stack.Screen name="signup" options={{headerShown:false,headerStyle: { backgroundColor: '#262526', },headerTintColor: 'white',headerTitleAlign:'center',headerTitle:'SIGN UP'}}/>
    </Stack>
  );
}

