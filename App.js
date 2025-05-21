import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import EventsScreen from './screens/EventsScreen';
import RadioScreen from './screens/RadioScreen';
import RadioVinylScreen from './screens/RadioVinylScreen';

const Tab = createBottomTabNavigator();

// Tema con fondo oscuro para toda la navegación
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0D1F2D',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Inicio') iconName = 'home';
            if (route.name === 'Calendario') iconName = 'calendar';
            if (route.name === 'Eventos') iconName = 'ticket';
            if (route.name === 'Radio') iconName = 'play-circle';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1DB954',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1d2e3d',
          },
        })}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Calendario" component={CalendarScreen} />
        <Tab.Screen name="Eventos" component={EventsScreen} />
        <Tab.Screen name="Radio" component={RadioScreen} />
        <Tab.Screen name="Vinyl" component={RadioVinylScreen} />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}
