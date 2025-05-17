// CalendarScreen.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos Retro</Text>
      <Calendar
        markedDates={{
          '2025-05-15': { marked: true, dotColor: 'red' },
          '2025-05-20': { marked: true, dotColor: 'blue' },
        }}
        onDayPress={(day) => {
          console.log('Día seleccionado', day);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
