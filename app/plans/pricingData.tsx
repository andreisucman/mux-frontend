import {
  IconAdjustmentsHorizontal,
  IconAnalyze,
  IconBooks,
  IconBrandYoutube,
  IconBubbleText,
  IconCameraSelfie,
  IconCash,
  IconCashBanknote,
  IconChecklist,
  IconEye,
  IconGitCompare,
  IconHandGrab,
  IconMessages,
  IconMoodCheck,
  IconNotebook,
  IconScaleOutline,
  IconScoreboard,
  IconToolsKitchen2,
  IconUser,
} from "@tabler/icons-react";
import { rem } from "@mantine/core";

const style = { minWidth: rem(24), minHeight: rem(24) };

export const freePlanContent = [
  {
    icon: <IconBrandYoutube className="icon icon__large" style={style} />,
    description: "See the inspirational proof and before-and-after photos and videos.",
  },
  {
    icon: <IconBooks className="icon icon__large" style={style} />,
    description: "Access the database of tasks with the recommended products.",
  },
  {
    icon: <IconCameraSelfie className="icon icon__large" style={style} />,
    description:
      "Scan your head and body weekly to identify your concerns and the maximum potential.",
  },
  {
    icon: <IconChecklist className="icon icon__large" style={style} />,
    description: "Create tasks to address your health an appearance concerns.",
  },
  {
    icon: <IconAdjustmentsHorizontal className="icon icon__large" style={style} />,
    description: "Analyze your outlook and get feedback on how to improve it.",
  },
  {
    icon: <IconScaleOutline className="icon icon__large" style={style} />,
    description: "Analyze food to improve and maintain weight.",
  },
  {
    icon: <IconCashBanknote className="icon icon__large" style={style} />,
    description: "Get valuable monthly prizes for consistency.",
  },
  {
    icon: <IconCash className="icon icon__large" style={style} />,
    description: "Earn by sharing your progress and inspiring others.",
  },
];

export const peekLicenseContent = [
  {
    icon: <IconHandGrab className="icon icon__large" style={style} />,
    description: "See and steal the most effective routines of the club members.",
  },
  {
    icon: <IconEye className="icon icon__large" style={style} />,
    description: "See the about info and socials of the club members.",
  },
  {
    icon: <IconNotebook className="icon icon__large" style={style} />,
    description: "Read the progress diary of the club members.",
  },
  {
    icon: <IconBubbleText className="icon icon__large" style={style} />,
    description: "See the answers to the FAQs of the club members.",
  },
];

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
    description: "Displays your scores on your results card for future reference.",
  },
  ,
];

export const advisorCoachContent = [
  {
    icon: <IconMessages className="icon icon__large" style={style} />,
    description: "1. Answers your questions about routines, tasks. products and food.",
  },
  {
    icon: <IconMoodCheck className="icon icon__large" style={style} />,
    description:
      "2. Helps you choose the best products based on your preferences and special considerations.",
  },
  {
    icon: <IconNotebook className="icon icon__large" style={style} />,
    description: "3. Helps you find and summarize your diary notes and FAQ answers.",
  },
  {
    icon: <IconUser className="icon icon__large" style={style} />,
    description: "4. Answers your questions about the person you follow.",
  },
];
