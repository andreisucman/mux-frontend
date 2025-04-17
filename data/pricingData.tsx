import {
  IconAnalyze,
  IconCamera,
  IconChecklist,
  IconListCheck,
  IconNotebook,
  IconPencil,
} from "@tabler/icons-react";
import { rem } from "@mantine/core";

const style = { minWidth: rem(24), minHeight: rem(24) };

export const improvementCoachContent = [
  {
    icon: <IconChecklist className="icon icon__large" style={style} />,
    description: "Creates weekly routines based on your physical condition and concerns.",
  },
  {
    icon: <IconPencil className="icon icon__large" style={style} />,
    description: "Drafts your manual task description and instructions.",
  },
];

export const scanAnalysisContent = [
  {
    icon: <IconAnalyze className="icon icon__large" style={style} />,
    description: "Resets your scan timer to today",
  },
];

export const generalPlanContent = [
  {
    icon: <IconListCheck className="icon icon__large" />,
    description: "See and copy tasks from the routines.",
  },
  {
    icon: <IconNotebook className="icon icon__large" style={{ minWidth: rem(24) }} />,
    description: "Read the feedback and insights from the diary.",
  },
  {
    icon: <IconCamera className="icon icon__large" />,
    description: "See how to complete each task from proofs.",
  },
];
