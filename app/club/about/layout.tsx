import React from "react";
import ClubModerationLayout from "../ModerationLayout";

type Props = {
  children: React.ReactNode;
};

export default function ClubAboutLayout({ children }: Props) {
  return <ClubModerationLayout>{children}</ClubModerationLayout>;
}
