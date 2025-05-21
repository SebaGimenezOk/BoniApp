import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoBona from "../assets/logoblancocalendario.png"

export default function CalendarScreen() {
  return (
    <LinearGradient
      colors={['#0D1F2D', '#1d2e3d', '#0D1F2D']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
                  <Image
                    source={LogoBona}
                    style={styles.coverImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.text}>Próximos Eventos 🎉</Text>
                </View>
      
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
            <Text style={styles.title}>📅 Elige el tuyo!</Text>
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
    fontSize: 20,
    fontWeight:'thin',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing:3,
  },
  calendarContainer: {
    width: '95%',
    alignSelf: 'center',
    marginBottom:20,
    
  },
  coverImage: {
    width: 250,
    height: 180,
    borderRadius: 20,
  },
  text: {
    fontSize: 20,
    color: 'white',
    marginLeft:20,
    marginBottom:30,
  }
});
