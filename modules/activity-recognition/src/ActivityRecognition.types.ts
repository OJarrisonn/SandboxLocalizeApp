export type ActivityRecognitionModuleEvents = {
  onActivityUpdate: (activity: ActivityData) => void;
};

export type ActivityData = {
  type: string;
  confidence: number;
};

export type ActivityType = "EM_VEICULO" | "NA_BICICLETA" | "A_PE" | "CORRENDO" | "PARADO" | "CAMINHANDO"