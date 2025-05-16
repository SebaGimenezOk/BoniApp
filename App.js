import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';

const STREAM_URL = 'https://radiostreamingserver.com.ar/proxy/bonami/stream?type=.mp3'

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const sound = useRef(new Audio.Sound());

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      shouldDuckAndroid: true,
    });

    return () => {
      sound.current && sound.current.unloadAsync();
    };
  }, []);

  const togglePlay = async () => {
    if (isPlaying) {
      await sound.current.pauseAsync();
      setIsPlaying(false);
    } else {
      try {
        await sound.current.unloadAsync();
        await sound.current.loadAsync(
          { uri: STREAM_URL },
          { shouldPlay: true }
        );
        setIsPlaying(true);
      } catch (error) {
        console.error('Error al reproducir:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bonami Radio</Text>
      <Button
        title={isPlaying ? '⏸️ Pausar' : '▶️ Reproducir'}
        onPress={togglePlay}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
