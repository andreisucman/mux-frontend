import React from "react";
import CreateRoutineSuggestionProvider from "@/context/CreateRoutineSuggestionContext";

export default function SuggestLayout({ children }: { children: React.ReactNode }) {
  return <CreateRoutineSuggestionProvider>{children}</CreateRoutineSuggestionProvider>;
}
