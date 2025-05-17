import {
  IconCancel,
  IconCheckbox,
  IconClock,
  IconMan,
  IconMoodNeutral,
  IconNotebook,
  IconRoute,
  IconTargetArrow,
  IconVideo,
  IconWhirl,
} from "@tabler/icons-react";

export const partIcons: { [key: string]: React.ReactNode } = {
  face: <IconMoodNeutral size={20} />,
  hair: <IconWhirl size={20} />,
  body: <IconMan size={20} />,
};

export const pageTypeIcons: { [key: string]: React.ReactNode } = {
  routines: <IconRoute size={20} />,
  progress: <IconTargetArrow size={20} />,
  proof: <IconVideo size={20} />,
  diary: <IconNotebook size={20} />,
};

export const statusIcons = {
  completed: <IconCheckbox size={20} style={{ display: "flex" }} />,
  expired: <IconClock size={20} style={{ display: "flex" }} />,
  canceled: <IconCancel size={20} style={{ display: "flex" }} />,
};

const getPartIcon = (key: string, size: number) => {
  switch (key) {
    case "face":
      return <IconMoodNeutral size={size} />;
    case "hair":
      return <IconWhirl size={size} />;
  }
};

const getCategoryIcon = (key: string, className: string) => {
  switch (key) {
    case "routines":
      return <IconTargetArrow className={`icon ${className}`} />;
    case "progress":
      return <IconTargetArrow className={`icon ${className}`} />;
    case "proof":
      return <IconVideo className={`icon ${className}`} />;
    case "diary":
      return <IconNotebook className={`icon ${className}`} />;
  }
};

export { getCategoryIcon, getPartIcon };
