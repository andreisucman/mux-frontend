export type AboutQuestionType = {
  _id: string;
  userId: string;
  updatedAt: string;
  question: string;
  answer: string;
  skipped: boolean;
  asking: string;
};

export type SubmitAboutResponseType = {
  question: string;
  answer: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setText: React.Dispatch<React.SetStateAction<string>>;
};
