import { IconAnalyze, IconCamera, IconListDetails, IconNotebook } from "@tabler/icons-react";
import { rem } from "@mantine/core";

const style = { minWidth: rem(24), minHeight: rem(24) };

export const routineSuggestionContent = [
  {
    icon: <IconAnalyze size={24} style={style} />,
    description: "Resets your routine suggestion timer to today.",
  },
];

export const scanAnalysisContent = [
  {
    icon: <IconAnalyze size={24} style={style} />,
    description: "Resets your scan timer to today.",
  },
];

export const generalPlanContent = [
  {
    icon: <IconListDetails size={24} />,
    description: "See and copy tasks from the routines.",
  },
  {
    icon: <IconNotebook size={24} style={{ minWidth: rem(24) }} />,
    description: "Read the feedback and insights from the diary.",
  },
  {
    icon: <IconCamera size={24} />,
    description: "See how to complete each task from proofs.",
  },
];
