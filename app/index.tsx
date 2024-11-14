import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Button } from 'react-native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const LOCATION_TASK_NAME = 'BACKGROUND_LOCATION_TASK';

export default function Index() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function startBackgroundLocationTask() {
    if (Platform.OS === 'android' && !Device.isDevice) {
      setErrorMsg(
        'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
      );
      return;
    }

    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // 5 seconds
        distanceInterval: 0,
      });
    } else {
      setErrorMsg('Permission to access background location was denied');
    }
  }


  useEffect(() => {
    TaskManager.defineTask(LOCATION_TASK_NAME, async () => {
      try {
        const location = await Location.getCurrentPositionAsync({});
        console.log('Background location:', location);
        // You can update the state or send the location to your server here
        setLocation(location);
        return BackgroundFetch.BackgroundFetchResult.NewData;
      } catch (error) {
        console.error(error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
      }
    });

    startBackgroundLocationTask();
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}, Timestamp: ${new Date(location.timestamp)}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Location: {text}</Text>
    </View>
  );
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

