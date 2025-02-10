import {
  IconBubbleText,
  IconClipboardText,
  IconDental,
  IconGenderFemale,
  IconGenderMale,
  IconHanger,
  IconHeart,
  IconMan,
  IconMoodNeutral,
  IconMoodSmile,
  IconNotebook,
  IconTargetArrow,
  IconUserCircle,
  IconVideo,
  IconWhirl,
} from "@tabler/icons-react";

export const typeIcons: { [key: string]: React.ReactNode } = {
  head: <IconMoodSmile className="icon" />,
  body: <IconMan className="icon" />,
  health: <IconHeart className="icon" />,
};

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
  style: <IconTargetArrow className="icon" />,
  proof: <IconTargetArrow className="icon" />,
  diary: <IconNotebook className="icon" />,
  answers: <IconBubbleText className="icon" />,
};

export const sexIcons = {
  female: <IconGenderFemale className="icon" style={{ display: "flex" }} />,
  male: <IconGenderMale className="icon" style={{ display: "flex" }} />,
};

export const styleIcons: { [key: string]: string } = {
  rugged: "🛠️",
  athletic: "🎽",
  bohemian: "🌿",
  edgy: "💥",
  professional: "💼",
  classic: "🎩",
  minimalist: "🧑",
  casual: "🌊",
};

const getCategoryIcon = (key: string, className: string) => {
  switch (key) {
    case "about":
      return <IconUserCircle className={`icon ${className}`} />;
    case "progress":
      return <IconTargetArrow className={`icon ${className}`} />;
    case "proof":
      return <IconVideo className={`icon ${className}`} />;
    case "style":
      return <IconHanger className={`icon ${className}`} />;
    case "diary":
      return <IconNotebook className={`icon ${className}`} />;
    case "answer":
      return <IconBubbleText className={`icon ${className}`} />;
  }
};

const getTypeIcon = (key: string, className: string) => {
  switch (key) {
    case "head":
      return <IconMoodSmile className={`icon ${className}`} />;
    case "body":
      return <IconMan className={`icon ${className}`} />;
  }
};

export { getTypeIcon, getCategoryIcon };
