// Reexport the native module. On web, it will be resolved to ActivityRecognitionModule.web.ts
// and on native platforms to ActivityRecognitionModule.ts
export { default } from './src/ActivityRecognitionModule';
export * from  './src/ActivityRecognition.types';
