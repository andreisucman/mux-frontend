import React from "react";
import { IconDental, IconHeart, IconMan, IconMoodNeutral, IconWhirl } from "@tabler/icons-react";

export const partIconMap: { [key: string]: React.ReactNode } = {
  face: <IconMoodNeutral className="icon" />,
  mouth: <IconDental className="icon" />,
  scalp: <IconWhirl className="icon" />,
  body: <IconMan className="icon" />,
  health: <IconHeart className="icon" />,
};
