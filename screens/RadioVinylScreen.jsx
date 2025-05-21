import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Dimensions, Animated, Easing, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';

import logomuestra from '../assets/logomarronstreaming.png';
const RADIO_STREAM_URL = 'https://radiostreamingserver.com.ar/proxy/bonami/stream?type=.mp3';

const { width } = Dimensions.get('window');

export default function RadioViniloScreen() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [sound, setSound] = useState(null);
    const [volume, setVolume] = useState(1);
    const [elapsedTime, setElapsedTime] = useState(0);

    const rotation = useRef(new Animated.Value(0)).current;
    const tonearm = useRef(new Animated.Value(0)).current;
    const rotationAnim = useRef(null);
    const timerRef = useRef(null);

    const formatElapsedTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setElapsedTime(0);
    };

    const startRotation = () => {
        rotation.setValue(0);
        rotationAnim.current = Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        rotationAnim.current.start();
    };

    const stopRotation = () => {
        if (rotationAnim.current) {
            rotationAnim.current.stop();
        }
    };

    const moveTonearm = async () => {
        Animated.timing(tonearm, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start(async () => {
            await playRadio();
        });
    };

    const resetTonearm = () => {
        Animated.timing(tonearm, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }).start();
    };

    const playRadio = async () => {
        if (!sound) {
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: RADIO_STREAM_URL },
                { shouldPlay: true, volume }
            );
            setSound(newSound);
            setIsPlaying(true);
            setIsStarted(true);
            startTimer();
        } else {
            await sound.playAsync();
            setIsPlaying(true);
            startTimer();
        }
    };

    const pauseRadio = async () => {
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
            stopTimer();
        }
    };

    const stopRadio = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
        }
        setIsPlaying(false);
        stopTimer();
    };

    const handleStop = async () => {
        await stopRadio();
        stopRotation();
        resetTonearm();
        setIsStarted(false);
    };

    const togglePlay = async () => {
        if (isPlaying) {
            pauseRadio();
        } else {
            if (!isStarted) {
                startRotation();
                setTimeout(() => {
                    moveTonearm();
                }, 100);
            } else {
                await playRadio();
            }
        }
    };

    const handleVolumeChange = async (value) => {
        setVolume(value);
        if (sound) {
            await sound.setVolumeAsync(value);
        }
    };

    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const tonearmInterpolate = tonearm.interpolate({
        inputRange: [0, 1],
        outputRange: ['-45deg', '-2deg'],
    });

    return (
        <View style={styles.container}>
            <Image
                source={logomuestra}
                style={styles.coverImage}
                resizeMode="contain"
            />

            <View style={styles.playerBox}>
                <Animated.Image
                    source={require('../assets/vinilo.png')}
                    style={[styles.vinyl, { transform: [{ rotate: rotateInterpolate }] }]} />
                <Animated.Image
                    source={require('../assets/pua.png')}
                    style={[styles.tonearm, { transform: [{ rotate: tonearmInterpolate }] }]} />
            </View>

            <View style={styles.controls}>
                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="backward" size={26} color="#8c7860" />
                </TouchableOpacity>
                <TouchableOpacity onPress={togglePlay} style={styles.iconButton}>
                    <FontAwesome name={isPlaying ? 'pause' : 'play'} size={30} color="#8c7860" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleStop} style={styles.iconButton}>
                    <FontAwesome name="stop" size={30} color="#8c7860" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="forward" size={26} color="#8c7860" />
                </TouchableOpacity>
            </View>

            <Text style={styles.timeText}>
                ON AIR: {formatElapsedTime(elapsedTime)}
            </Text>

            <View style={styles.volumeBox}>
                
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={volume}
                    onValueChange={handleVolumeChange}
                    minimumTrackTintColor="#8c7860"
                    maximumTrackTintColor="#aaa"
                    thumbTintColor="#8c7860"
                />
                 <Text style={styles.volumeText}>
                            VOLUMEN: {(volume * 100).toFixed(0)}%
                          </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ddd3c4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerBox: {
        width: width * 0.8,
        height: width * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 20,
    },
    vinyl: {
        width: width * 0.5,
        height: width * 0.5,
        borderRadius: width * 0.25,
        position: 'absolute',
    },
    tonearm: {
        width: width * 0.9,
        height: width * 0.25,
        resizeMode: 'contain',
        position: 'absolute',
        top: width * 0.12,
        left: width * 0.20,
        zIndex: 2,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        marginBottom: 20,
    },
    iconButton: {
        padding: 14,
        borderRadius: 50,
    },
    coverImage: {
        width: 300,
        height: 90,
        borderRadius: 20,
        marginTop: 40,
    },
    volumeBox: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slider: {
        width: '90%',
    },
    timeText: {
        fontSize: 16,
        color: '#8c7860',
        marginBottom: 20,
    },volumeText: {
        color: '#8c7860',
        fontSize: 12,
      },
});
