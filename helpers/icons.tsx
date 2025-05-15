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
  face: <IconMoodNeutral className="icon" />,
  hair: <IconWhirl className="icon" />,
  body: <IconMan className="icon" />,
};

export const pageTypeIcons: { [key: string]: React.ReactNode } = {
  routines: <IconRoute className="icon" />,
  progress: <IconTargetArrow className="icon" />,
  proof: <IconVideo className="icon" />,
  diary: <IconNotebook className="icon" />,
};

export const statusIcons = {
  completed: <IconCheckbox className="icon" style={{ display: "flex" }} />,
  expired: <IconClock className="icon" style={{ display: "flex" }} />,
  canceled: <IconCancel className="icon" style={{ display: "flex" }} />,
};

const getPartIcon = (key: string, size:number) => {
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
