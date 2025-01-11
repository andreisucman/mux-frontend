import React from "react";
import CalorieGoalProvider from "@/context/CalorieGoalContext";

type Props = {
  children: React.ReactNode;
};

export default function AnalysisFoodLayout({ children }: Props) {
  return <CalorieGoalProvider>{children}</CalorieGoalProvider>;
}
