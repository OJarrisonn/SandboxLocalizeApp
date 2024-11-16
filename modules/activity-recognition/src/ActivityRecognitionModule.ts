import { NativeModule, requireNativeModule } from 'expo';

import { ActivityRecognitionModuleEvents } from './ActivityRecognition.types';

declare class ActivityRecognitionModule extends NativeModule<ActivityRecognitionModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ActivityRecognitionModule>('ActivityRecognition');
