import React from "react";
import CreateRoutineProvider from "@/context/CreateRoutineContext";

type Props = {
  children: React.ReactNode;
};

export default function TasksLayout({ children }: Props) {
  return <CreateRoutineProvider>{children}</CreateRoutineProvider>;
}
