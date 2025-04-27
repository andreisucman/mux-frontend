import React from "react";
import CreateRoutineProvider from "@/context/CreateRoutineContext";

export default function SuggestLayout({ children }: { children: React.ReactNode }) {
  return <CreateRoutineProvider>{children}</CreateRoutineProvider>;
}
