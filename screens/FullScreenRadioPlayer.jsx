// lib/FullRadioPlayer.js

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, AppState } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import muestrapic from '../assets/favicon.png';

export default function FullRadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const soundRef = useRef(null);
  const appState = useRef(AppState.currentState);

  const RADIO_STREAM_URL = 'https://radiostreamingserver.com.ar/proxy/bonami/stream?type=.mp3';

  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
          playsInSilentModeIOS: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
          allowsRecordingIOS: false,
        });
      } catch (e) {
        console.log('Error setup audio:', e);
      }
    })();

    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (soundRef.current && isPlaying) {
          const status = await soundRef.current.getStatusAsync();
          if (!status.isPlaying) {
            await soundRef.current.playAsync();
          }
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [isPlaying]);

  const handlePlayPause = async () => {
    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: RADIO_STREAM_URL },
          { shouldPlay: true, volume }
        );
        soundRef.current = sound;

        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) {
            setIsPlaying(false);
          } else if (status.didJustFinish) {
            setIsPlaying(false);
          }
        });

        setIsPlaying(true);
      } else {
        const status = await soundRef.current.getStatusAsync();
        if (status.isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error al reproducir audio:', error);
    }
  };

  const handleVolumeChange = async (value) => {
    setVolume(value);
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(value);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <Image
        source={muestrapic}
        style={{ width: 70, height: 70, borderRadius: 12, marginBottom: 20 }}
      />
      <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
        Bonami Retro Radio
      </Text>
      <Text style={{ color: '#aaa', fontSize: 16, marginBottom: 30 }}>
        🎶 En vivo - DJ Set
      </Text>

      <TouchableOpacity onPress={handlePlayPause} style={{ marginBottom: 30 }}>
        <AntDesign
          name={isPlaying ? 'pausecircle' : 'play'}
          size={64}
          color="#1DB954"
        />
      </TouchableOpacity>

      <Slider
        style={{ width: 250 }}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onValueChange={handleVolumeChange}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#fff"
        thumbTintColor="#1DB954"
      />
      <Text style={{ color: '#fff', marginTop: 10 }}>
        Volumen: {(volume * 100).toFixed(0)}%
      </Text>
    </View>
  );
}