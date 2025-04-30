import React from "react";
import CreateRoutineSuggestionProvider from "@/context/CreateRoutineSuggestionContext";

export default function RoutinesLayout({ children }: { children: React.ReactNode }) {
  return <CreateRoutineSuggestionProvider>{children}</CreateRoutineSuggestionProvider>;
}
