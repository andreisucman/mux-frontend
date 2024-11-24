export type RawTaskType = {
  name?: string;
  color?: string;
  icon?: string;
  description: string;
  instruction: string;
};

export type HandleSaveTaskProps = {
  isLoading: boolean;
  frequency: number;
  date: Date | null;
  rawTask?: RawTaskType;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
