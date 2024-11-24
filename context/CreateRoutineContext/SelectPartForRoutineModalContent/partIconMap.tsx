import React from "react";
import { IconDental, IconHeart, IconMan, IconMoodEmpty, IconWhirl } from "@tabler/icons-react";

export const partIconMap: { [key: string]: React.ReactNode } = {
  face: <IconMoodEmpty className="icon" />,
  mouth: <IconDental className="icon" />,
  scalp: <IconWhirl className="icon" />,
  body: <IconMan className="icon" />,
  health: <IconHeart className="icon" />,
};
