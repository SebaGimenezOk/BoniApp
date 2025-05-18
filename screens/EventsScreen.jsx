import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Linking } from 'react-native';

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          'https://www.eventbriteapi.com/v3/organizations/2762861675581/events/',
          {
            headers: {
              Authorization: 'Bearer 67PMBUCRLF6POKV7UUCP',
            },
          }
        );
        setEvents(response.data.events);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener eventos de Eventbrite:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const renderEvent = ({ item }) => (
    <View style={styles.eventContainer}>
      <Text style={styles.eventTitle}>{item.name.text}</Text>
      <Text>{item.description.text}</Text>
      <Text>{new Date(item.start.local).toLocaleDateString()}</Text>
      <TouchableOpacity
        onPress={() => Linking.openURL(item.url)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Ver Evento</Text>
      </TouchableOpacity>
      {item.logo && <Image source={{ uri: item.logo.url }} style={styles.eventImage} />}
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#FF6F00" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  eventContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#FF6F00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
