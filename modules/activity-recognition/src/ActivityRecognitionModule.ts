import { NativeModule, requireNativeModule } from 'expo';

import { ActivityRecognitionModuleEvents } from './ActivityRecognition.types';

declare class ActivityRecognitionModule extends NativeModule<ActivityRecognitionModuleEvents> {
  requestPermissionsAsync(): Promise<void>;
  startTracking(): Promise<void>;
  stopTracking(): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ActivityRecognitionModule>('ActivityRecognition');
