import React from "react";
import CreateRoutineSuggestionProvider from "@/context/CreateRoutineSuggestionContext";

type Props = {
  children: React.ReactNode;
};

export default function TasksLayout({ children }: Props) {
  return <CreateRoutineSuggestionProvider>{children}</CreateRoutineSuggestionProvider>;
}
