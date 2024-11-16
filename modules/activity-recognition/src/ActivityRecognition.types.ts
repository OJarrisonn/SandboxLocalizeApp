export type OnLoadEventPayload = {
  url: string;
};

export type ActivityRecognitionModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};
