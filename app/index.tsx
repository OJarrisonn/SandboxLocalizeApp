import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Button } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const LOCATION_TASK_NAME = 'BACKGROUND_LOCATION_TASK';

export default function Index() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locations, setLocations] = useState<{latitude: number, longitude: number}[]>([]);
  const [locating, setLocating] = useState(false);

  async function startBackgroundLocationTask() {
    if (Platform.OS === 'android' && !Device.isDevice) {
      setErrorMsg(
        'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
      );
      return;
    }

    const { status } = await Location.requestBackgroundPermissionsAsync();

    if (status === 'granted') {
      setLocations([]);
      setLocating(true);
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // 5 seconds
        distanceInterval: 0,
      });
    } else {
      setErrorMsg('Permission to access background location was denied');
    }
  }

  async function stopBackgroundLocationTask() {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    setLocating(false);
    setLocations([]);
  }

  async function copyGeoJSONLine() {
    const line = JSON.stringify(createGeoJSONLine(locations));
    await Clipboard.setStringAsync(line);
    console.log('GeoJSON Line:', line);
    setLocations([]);
  }

  useEffect(() => {
    TaskManager.defineTask(LOCATION_TASK_NAME, async () => {
      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setLocations([...locations, {latitude: location.coords.latitude, longitude: location.coords.longitude}]);
        console.log('New location:', location);
        console.log('Locations:', JSON.stringify(locations));
        return BackgroundFetch.BackgroundFetchResult.NewData;
      } catch (error) {
        console.error(error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Background Location</Text>
      <Text style={styles.paragraph}>{locating ? 'Locating...' : 'Not locating'}</Text>
      <Text style={styles.paragraph}>Samples taken: {locations.length}</Text>
      {errorMsg 
      ? <Text style={styles.paragraph}>Error: {errorMsg}</Text> 
      : location 
        ? <Text style={styles.paragraph}>
          Last location: ({location.coords.latitude}, {location.coords.longitude}){"\n"}
          Accuracy: {location.coords.accuracy}m{"\n"}
          Time: {new Date(location.timestamp).toLocaleTimeString()}
          </Text> 
        : <Text style={styles.paragraph}>Waiting...</Text>}
      <Button title="Start Location" onPress={startBackgroundLocationTask} />
      <Button title="Stop Location" onPress={stopBackgroundLocationTask} />
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

