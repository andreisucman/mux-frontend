import {
  IconAdjustmentsHorizontal,
  IconBooks,
  IconBrandYoutube,
  IconCameraSelfie,
  IconCash,
  IconCashBanknote,
  IconChecklist,
  IconEye,
  IconHandGrab,
  IconHandLoveYou,
  IconMessage2,
  IconNotebook,
  IconScaleOutline,
  IconShoppingBag,
  IconToolsKitchen2,
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
    description: "Create tasks to address your health, beauty, and body concerns.",
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
    icon: <IconNotebook className="icon icon__large" style={style} />,
    description: "See the progress diary of the club members.",
  },
  {
    icon: <IconEye className="icon icon__large" style={style} />,
    description: "Check the personality, style and tips of the club members.",
  },
  {
    icon: <IconMessage2 className="icon icon__large" style={style} />,
    description: "Ask questions about the club members.",
  },
];

export const improvementCoachContent = [
  {
    icon: <IconChecklist className="icon icon__large" style={style} />,
    description: "Creates weekly health, face, and body routines based on your physical condition.",
  },
  {
    icon: <IconToolsKitchen2 className="icon icon__large" style={style} />,
    description:
      "Suggest personalized recipes to match your calorie count based on your products, kitchenware and special considerations.",
  },
];

export const analystCoachContent = [
  {
    icon: <IconShoppingBag className="icon icon__large" style={style} />,
    description:
      "Chooses the best products for your tasks based on your criteria and special considerations.",
  },
];

export const advisorCoachContent = [
  {
    icon: <IconMessage2 className="icon icon__large" style={style} />,
    description: "Answers your questions about progress, tasks, and more.",
  },
  {
    icon: <IconHandLoveYou className="icon icon__large" style={style} />,
    description:
      "Gives you an honest opinion about your style and product fit based on product images and your appearance",
  },
];
