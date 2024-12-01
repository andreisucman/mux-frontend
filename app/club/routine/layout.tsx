import React from "react";
import ClubModerationLayout from "../ModerationLayout";

type Props = {
  children: React.ReactNode;
};

export default function ClubRoutineLayout({ children }: Props) {
  return <ClubModerationLayout showChat showHeader>{children}</ClubModerationLayout>;
}
