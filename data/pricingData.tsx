import { IconAnalyze, IconCamera, IconListDetails, IconNotebook } from "@tabler/icons-react";
import { rem } from "@mantine/core";

const style = { minWidth: rem(24), minHeight: rem(24) };

export const routineSuggestionContent = [
  {
    icon: <IconAnalyze className="icon icon__large" style={style} />,
    description: "Resets your routine suggestion timer to today.",
  },
];

export const scanAnalysisContent = [
  {
    icon: <IconAnalyze className="icon icon__large" style={style} />,
    description: "Resets your scan timer to today.",
  },
];

export const generalPlanContent = [
  {
    icon: <IconListDetails className="icon icon__large" />,
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
