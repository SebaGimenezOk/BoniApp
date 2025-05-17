import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import EventsScreen from './screens/EventsScreen';
import RadioScreen from './screens/RadioScreen';





const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
        })}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Calendario" component={CalendarScreen} />
        <Tab.Screen name="Eventos" component={EventsScreen} />
        <Tab.Screen name="Radio" component={RadioScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}