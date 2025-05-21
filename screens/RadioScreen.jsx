import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import muestrapic from '../assets/logoblancostreaming.png';

export default function RadioScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [positionMillis, setPositionMillis] = useState(0);
  const soundRef = useRef(null);

  const RADIO_STREAM_URL = 'https://radiostreamingserver.com.ar/proxy/bonami/stream?type=.mp3';

  useEffect(() => {
    (async () => {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        playsInSilentModeIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      });
    })();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

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
          } else {
            setPositionMillis(status.positionMillis || 0);

            if (status.didJustFinish) {
              setIsPlaying(false);
              setPositionMillis(0);
            }
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
    <LinearGradient
      colors={['#0D1F2D', '#1d2e3d', '#0D1F2D']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.bloque}>

        {/* 1. LOGO */}
        <View style={styles.logoContainer}>
          <Image
            source={muestrapic}
            style={styles.coverImage}
            resizeMode="contain"
          />
        </View>

        {/* 2. CONTROLES */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity>
            <AntDesign name="stepbackward" size={34} color="#1DB954" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePlayPause}>
            <AntDesign
              name={isPlaying ? 'pausecircle' : 'play'}
              size={72}
              color="#1DB954"
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <AntDesign name="stepforward" size={34} color="#1DB954" />
          </TouchableOpacity>
        </View>

        {/* 3. SLIDER + TIEMPO + VOLUMEN */}
        <View style={styles.sliderSection}>
          <Text style={styles.timeText}>
          ON AIR: {formatTime(positionMillis)}
          </Text>
          <View style={styles.sliderContainer}>
            <Entypo name="sound" size={24} color="#1DB954" />
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor="#1DB954"
              maximumTrackTintColor="#fff"
              thumbTintColor="#1DB954"
            />
            <Entypo name="sound-mute" size={24} color="#555" />
          </View>
          <Text style={styles.volumeText}>
            VOLUMEN: {(volume * 100).toFixed(0)}%
          </Text>

        </View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloque: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1,
  
  },
  logoContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  coverImage: {
    width: 250,
    height: 180,
    borderRadius: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginRight:15,
    gap: 20,
    position: 'relative',
    top: -20, // sube el bloque 2
  },
  sliderSection: {
    alignItems: 'center',
    marginBottom: 20,
    width: '60%',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    marginLeft:15,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  volumeText: {
    color: '#fff',
    fontSize: 12,
  },
});
