import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatternLockScreen from './src/screens/PatternLockScreen';
import HomeScreen from './src/screens/HomeScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>

   <SafeAreaProvider>
      <SafeAreaView style={{flex: 1,}}>
      <Stack.Navigator
        initialRouteName="Lock"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Lock" component={PatternLockScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
      </SafeAreaView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
