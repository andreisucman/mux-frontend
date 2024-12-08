import {
  IconDental,
  IconHeart,
  IconMan,
  IconMoodNeutral,
  IconMoodSmile,
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
};

const getTypeIcon = (key: string, className: string) => {
  switch (key) {
    case "head":
      return <IconMoodSmile className={`icon ${className}`} />;
    case "body":
      return <IconMan className={`icon ${className}`} />;
    case "health":
      return <IconHeart className={`icon ${className}`} />;
  }
};

const getPartIcon = (key: string, className: string) => {
  switch (key) {
    case "face":
      return <IconMoodNeutral className={`icon ${className}`} />;
    case "mouth":
      return <IconDental className={`icon ${className}`} />;
    case "scalp":
      return <IconWhirl className={`icon ${className}`} />;
  }
};

export { getTypeIcon, getPartIcon };
