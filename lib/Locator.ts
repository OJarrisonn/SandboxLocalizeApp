import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

export const LOCATION_TASK_NAME: string = 'BACKGROUND_LOCATION_TASK';

export class Locator {
    locations: Location.LocationObject[] = [];
    locating: boolean = false;
    private successSubscribers: {[key: string]: ((location: Location.LocationObject) => void)} = {};
    private errorSubscribers: {[key: string]: ((error: any) => void)} = {};

    async askPermissions() {
        const { status } = await Location.requestBackgroundPermissionsAsync();
        return status;
    }

    async startLocationUpdates(timeInterval: number = 5000) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.High,
            timeInterval,
            distanceInterval: 0,
        });
        this.locating = true;
        
        TaskManager.defineTask(LOCATION_TASK_NAME, async () => {
            try {
              const location = await Location.getCurrentPositionAsync({});
              this.locations.push(location);
              this.notifySuccessListeners(location);
              return BackgroundFetch.BackgroundFetchResult.NewData;
            } catch (error) {
              this.notifyErrorListeners(error);
              return BackgroundFetch.BackgroundFetchResult.Failed;
            }
          });
    }

    async stopLocationUpdates() {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        this.locating = false;
        TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
    }

    getLatestLocation() {
        if (this.locations.length === 0) {
            return null;
        }
        return this.locations[this.locations.length - 1];
    }

    popLocations() {
        const locations = this.locations;
        this.locations = [];
        return locations;
    }

    subscribeToLocationUpdates(subscriberId: string, listener: (location: Location.LocationObject) => void) {
        this.successSubscribers[subscriberId] = listener;
    }

    unsubscribeFromLocationUpdates(subscriberId: string) {
        delete this.successSubscribers[subscriberId];
    }

    subscribeToErrors(subscriberId: string, listener: (error: any) => void) {
        this.errorSubscribers[subscriberId] = listener;
    }

    unsubscribeFromErrors(subscriberId: string) {
        delete this.errorSubscribers[subscriberId];
    }

    private notifySuccessListeners(location: Location.LocationObject) {
        Object.values(this.successSubscribers).forEach(subscriber => subscriber(location));
    }

    private notifyErrorListeners(error: any) {
        Object.values(this.errorSubscribers).forEach(subscriber => subscriber(error));
    }
}