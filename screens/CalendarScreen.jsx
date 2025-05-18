import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CalendarScreen() {
  return (
    <LinearGradient
      colors={['#0D1F2D', '#1d2e3d', '#0D1F2D']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>📅 Eventos Retro</Text>
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={{
              '2025-05-15': { marked: true, dotColor: '#1DB954' },
              '2025-05-20': { marked: true, dotColor: '#1DB954' },
            }}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: '#ccc',
              dayTextColor: '#fff',
              todayTextColor: '#1DB954',
              selectedDayTextColor: '#fff',
              monthTextColor: '#fff',
              arrowColor: '#1DB954',
              dotColor: '#1DB954',
            }}
            onDayPress={(day) => {
              console.log('Día seleccionado', day);
            }}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginBottom: 20,
    textAlign: 'center',
  },
  calendarContainer: {
    width: '95%',
    alignSelf: 'center',
  },
});
