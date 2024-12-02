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

export const typeItems = [
  { label: "Head", value: "head" },
  { label: "Body", value: "body" },
  { label: "Health", value: "health" },
];

export const partIcons: { [key: string]: React.ReactNode } = {
  face: <IconMoodNeutral className="icon" />,
  mouth: <IconDental className="icon" />,
  scalp: <IconWhirl className="icon" />,
};

export const partItems = [
  { label: "Face", value: "face", type: "head" },
  { label: "Mouth", value: "mouth", type: "head" },
  { label: "Scalp", value: "scalp", type: "head" },
];
