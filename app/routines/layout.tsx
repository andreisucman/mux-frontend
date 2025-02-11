import React from "react";
import CreateRoutineProvider from "@/context/CreateRoutineContext";

export default function RoutinesLayout({ children }: { children: React.ReactNode }) {
  return <CreateRoutineProvider>{children}</CreateRoutineProvider>;
}
