import { SuggestionType } from "@/types/global";

export default function getSuggestions(
  suggestions?: SuggestionType[],
  defaultSuggestions?: SuggestionType[]
) {
  if (!suggestions) return;
  if (!defaultSuggestions) return;

  if (suggestions.length === 0) {
    return defaultSuggestions;
  }

  return suggestions;
}
