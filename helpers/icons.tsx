import {
  IconBubbleText,
  IconClipboardText,
  IconDental,
  IconGenderFemale,
  IconGenderMale,
  IconMan,
  IconMoodNeutral,
  IconNotebook,
  IconTargetArrow,
  IconUserCircle,
  IconVideo,
  IconWhirl,
} from "@tabler/icons-react";

export const partIcons: { [key: string]: React.ReactNode } = {
  face: <IconMoodNeutral className="icon" />,
  mouth: <IconDental className="icon" />,
  scalp: <IconWhirl className="icon" />,
  body: <IconMan className="icon" />,
};

export const pageTypeIcons: { [key: string]: React.ReactNode } = {
  about: <IconUserCircle className="icon" />,
  routines: <IconClipboardText className="icon" />,
  progress: <IconTargetArrow className="icon" />,
  proof: <IconTargetArrow className="icon" />,
  diary: <IconNotebook className="icon" />,
  answers: <IconBubbleText className="icon" />,
};

export const sexIcons = {
  female: <IconGenderFemale className="icon" style={{ display: "flex" }} />,
  male: <IconGenderMale className="icon" style={{ display: "flex" }} />,
};

const getPartIcon = (key: string, className: string) => {
  switch (key) {
    case "face":
      return <IconMoodNeutral className={`icon ${className}`} />;
    case "mouth":
      return <IconDental className={`icon ${className}`} />;
    case "scalp":
      return <IconWhirl className={`icon ${className}`} />;
    case "body":
      return <IconMan className={`icon ${className}`} />;
  }
};

const getCategoryIcon = (key: string, className: string) => {
  switch (key) {
    case "about":
      return <IconUserCircle className={`icon ${className}`} />;
    case "progress":
      return <IconTargetArrow className={`icon ${className}`} />;
    case "proof":
      return <IconVideo className={`icon ${className}`} />;
    case "diary":
      return <IconNotebook className={`icon ${className}`} />;
    case "answer":
      return <IconBubbleText className={`icon ${className}`} />;
  }
};

export { getCategoryIcon, getPartIcon };
