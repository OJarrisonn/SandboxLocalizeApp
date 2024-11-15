import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';
import { useLocation } from '@/hooks/useLocation';


export default function Index() {
  const locator = useLocation();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  async function copyGeoJSONLine() {
    const line = JSON.stringify(createGeoJSONLine(locator.popLocations().map(location => location.coords)));
    await Clipboard.setStringAsync(line);
    console.log('GeoJSON Line:', line);
  }

  useEffect(() => {
    const askPermissions = async () => {
      const status = await locator.askPermissions();
      if (status !== 'granted') {
        console.error('Location permission denied');
      } else {
        console.log('Location permission granted');
      }
      locator.subscribeToLocationUpdates('index', setLocation);
      locator.subscribeToLocationUpdates('logger', location => console.log('New Location:', location));
    };

    askPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Background Location</Text>
      <Text style={styles.paragraph}>{locator.locating ? 'Locating...' : 'Not locating'}</Text>
      <Text style={styles.paragraph}>Samples taken: {locator.locations.length}</Text>
      {location 
        ? <Text style={styles.paragraph}>
          Last location: ({location?.coords.latitude}, {location?.coords.longitude}){"\n"}
          Accuracy: {location?.coords.accuracy}m{"\n"}
          Time: {new Date(location?.timestamp).toLocaleTimeString()}
          </Text> 
        : <Text style={styles.paragraph}>Waiting...</Text>}
      <Button title="Start Location" onPress={async () => await locator.startLocationUpdates()} />
      <Button title="Stop Location" onPress={async () => await locator.stopLocationUpdates()} />
      <Button title="Produce GeoJSON Line" onPress={copyGeoJSONLine} />
    </View>
  );
}

function createGeoJSONLine(locations: {latitude: number, longitude: number}[]) {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: locations.map(location => [location.longitude, location.latitude]),
    },
  };  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});

