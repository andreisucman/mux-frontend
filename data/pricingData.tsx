import {
  IconAnalyze,
  IconChecklist,
  IconGitCompare,
  IconMessages,
  IconMoodCheck,
  IconNotebook,
  IconScoreboard,
  IconToolsKitchen2,
  IconUser,
} from "@tabler/icons-react";
import { rem } from "@mantine/core";

const style = { minWidth: rem(24), minHeight: rem(24) };

export const improvementCoachContent = [
  {
    icon: <IconChecklist className="icon icon__large" style={style} />,
    description: "Creates weekly routines based on your physical condition and concerns.",
  },
  {
    icon: <IconToolsKitchen2 className="icon icon__large" style={style} />,
    description:
      "Suggests personal recipes to match your calorie count based on your physical condition, products at hand and kitchenware.",
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
    description: "Displays your scores under your images for future reference.",
  },
  ,
];

export const advisorCoachContent = [
  {
    icon: <IconMessages className="icon icon__large" style={style} />,
    description: "Answers your questions about routines, tasks. products and food.",
  },
  {
    icon: <IconMoodCheck className="icon icon__large" style={style} />,
    description:
      "Helps you choose the best products based on your preferences and special considerations.",
  },
  {
    icon: <IconNotebook className="icon icon__large" style={style} />,
    description: "Helps you find and summarize your diary notes and FAQ answers.",
  },
  {
    icon: <IconUser className="icon icon__large" style={style} />,
    description: "Answers your questions about the person you follow.",
  },
];
