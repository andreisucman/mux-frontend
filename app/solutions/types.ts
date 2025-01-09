import { SuggestionType } from "@/types/global";

export type SolutionCardType = {
  _id: string;
  icon: string;
  color: string;
  name: string;
  description: string;
  instruction: string;
  example: { type: string; url: string };
  suggestions: SuggestionType[];
};

export type SpotlightActionType = {
  id: string;
  label: string;
  leftSection: React.ReactNode;
  onClick: () => void;
};
