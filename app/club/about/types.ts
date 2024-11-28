export type SubmitAboutResponseType = {
  question: string;
  reply: string;
  audioBlobs: Blob[] | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setText: React.Dispatch<React.SetStateAction<string>>;
};
