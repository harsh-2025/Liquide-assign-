import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './src/context/CartContext';
import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import OrderSuccessScreen from './src/screens/OrderSuccess';

export type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
  OrderSuccess: undefined; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
