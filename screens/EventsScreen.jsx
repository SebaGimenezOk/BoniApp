import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const TOKEN = '67PMBUCRLF6POKV7UUCP'; // Reemplaza con tu token
const ORGANIZATION_ID = '2762861675581'; // Reemplaza con tu organization_id

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`https://www.eventbriteapi.com/v3/organizations/${ORGANIZATION_ID}/events/`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
        params: {
          status: 'live',
          expand: 'venue',
        },
      });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error al obtener eventos de Eventbrite:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name.text}</Text>
      <Text style={styles.date}>{new Date(item.start.local).toLocaleString()}</Text>
      <Text style={styles.location}>{item.venue?.address?.localized_address_display}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff0055" />
        <Text style={{ marginTop: 10 }}>Cargando eventos...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  date: {
    color: '#777',
    marginTop: 5,
  },
  location: {
    color: '#444',
    marginTop: 5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
