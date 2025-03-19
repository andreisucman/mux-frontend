import {
  IconAnalyze,
  IconCamera,
  IconChecklist,
  IconGitCompare,
  IconHandGrab,
  IconMessages,
  IconMoodCheck,
  IconNotebook,
  IconPencil,
  IconRotate,
  IconScoreboard,
  IconTargetArrow,
  IconToolsKitchen2,
} from "@tabler/icons-react";
import { rem } from "@mantine/core";

const style = { minWidth: rem(24), minHeight: rem(24) };

export const improvementCoachContent = [
  {
    icon: <IconPencil className="icon icon__large" style={style} />,
    description: "Drafts your manual task description and instructions.",
  },
  {
    icon: <IconChecklist className="icon icon__large" style={style} />,
    description: "Creates weekly routines based on your physical condition and concerns.",
  },
  {
    icon: <IconToolsKitchen2 className="icon icon__large" style={style} />,
    description:
      "Suggests personal recipes to match your calorie amount based on your physical condition, products at hand and kitchenware.",
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

export const advisorCoachContent = [
  {
    icon: <IconMessages className="icon icon__large" style={style} />,
    description: "Answers your questions about routines, tasks, and food.",
  },
  {
    icon: <IconMoodCheck className="icon icon__large" style={style} />,
    description:
      "Helps you choose the best products for your tasks based on your preferences and special considerations.",
  },
  {
    icon: <IconNotebook className="icon icon__large" style={style} />,
    description: "Summarizes information and helps find specific feedback in the diary.",
  },
];

export const generalPlanContent = [
  {
    icon: <IconHandGrab className="icon icon__large" />,
    description: "See and copy the proven tasks from the routine.",
  },
  {
    icon: <IconNotebook className="icon icon__large" style={{ minWidth: rem(20) }} />,
    description: "Learn the feedback and insights from the progress diary.",
  },
  {
    icon: <IconCamera className="icon icon__large" />,
    description: "See how to complete each task from proofs.",
  },
  {
    icon: <IconTargetArrow className="icon icon__large" />,
    description: "Get similar transformation.",
  },
];

export const updateContent = [
  {
    icon: (
      <IconRotate className="icon icon__large" style={{ minWidth: rem(20), minHeight: rem(20) }} />
    ),
    description: "See the latest task, progress, diary, and proofs as they get uploaded.",
  },
];
