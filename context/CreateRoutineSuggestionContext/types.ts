import { PartEnum, ScoreType } from "@/types/global";

export type RoutineSuggestionTaskType = {
  icon: string;
  task: string;
  color: string;
  concern: string;
  numberOfTimesInAMonth: number;
};

export type RoutineSuggestionType = {
  _id: string;
  userId: string;
  part: PartEnum;
  lastCreatedOn: string;
  questionsAndAnswers: { [question: string]: string };
  tasks: { [key: string]: RoutineSuggestionTaskType[] };
  summary: string;
  reasoning: string;
  concernScores: ScoreType[];
  previousExperience: {
    [key: string]: string;
  };
  isRevised: boolean;
};
