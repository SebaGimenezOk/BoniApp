import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import logoBonami from '../assets/2blanco250.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#0D1F2D', '#1d2e3d', '#0D1F2D']} // ✅ importante
      style={styles.gradient} // ✅ importante
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image
            source={logoBonami}
            style={styles.coverImage}
            resizeMode="contain"
          />
          <Text style={styles.text}>Bienvenido a la app 🎉</Text>
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
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'white', // ✅ para que se vea sobre fondo oscuro
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginBottom: 6,
  },
});
