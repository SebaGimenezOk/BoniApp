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
import muestrapic from '../assets/2blanco250.png';

export default function RadioScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [title, setTitle] = useState(null);
  const [artist, setArtist] = useState(null);
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

            setTitle(status.metadata && status.metadata.title ? status.metadata.title : null);
            setArtist(status.metadata && status.metadata.artist ? status.metadata.artist : null);

            if (status.didJustFinish) {
              setIsPlaying(false);
              setTitle(null);
              setArtist(null);
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
      <Image
        source={muestrapic}
        style={styles.coverImage}
        resizeMode="contain"
      />
      {/* <Text style={styles.title}>Bonami Radio</Text> */}
      {/* <Text style={styles.subtitle}> 🎶 En vivo</Text> */}

      {title && <Text style={styles.metadataText}>🎵 {title}</Text>}
      {artist && <Text style={styles.metadataText}>👤 {artist}</Text>}

      <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>

      <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseBtn}>
        <View style={styles.playPauseWrapper}>
          <AntDesign
            name={isPlaying ? 'pausecircle' : 'play'}
            size={72}
            color="#1DB954"
          />
        </View>
      </TouchableOpacity>

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

      <Text style={styles.volumeText}>Volumen: {(volume * 100).toFixed(0)}%</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginBottom: 6,
 
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 18,
    marginBottom: 20,
  },
  metadataText: {
    color: '#1DB954',
    fontSize: 16,
    marginBottom: 4,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 20,
  },
  playPauseBtn: {
    marginBottom: 30,
  },
  playPauseWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 280,
    marginBottom: 10,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  volumeText: {
    color: '#fff',
    fontSize: 10,
  },
});
