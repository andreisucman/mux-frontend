import {
  IconAnalyze,
  IconCamera,
  IconChecklist,
  IconGitCompare,
  IconHandGrab,
  IconListCheck,
  IconNotebook,
  IconPencil,
  IconRotate,
  IconScoreboard,
  IconToolsKitchen2,
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
    description: "Analyzes your appearance and provides a score for different body features.",
  },
  {
    icon: <IconGitCompare className="icon icon__large" style={style} />,
    description: "Compares your current condition with the previous and explains what changed.",
  },
  {
    icon: <IconScoreboard className="icon icon__large" style={style} />,
    description: "Displays your scores under your images to highlight your progress.",
  },
  ,
];

export const generalPlanContent = [
  {
    icon: <IconListCheck className="icon icon__large" />,
    description: "See and copy tasks from the routine.",
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
