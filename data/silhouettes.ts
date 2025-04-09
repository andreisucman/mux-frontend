import { PartEnum } from "@/context/ScanPartsChoicesContext/types";
import { PositionEnum } from "@/types/global";

export const silhouettes: {
  sex: string[];
  part?: PartEnum;
  position?: PositionEnum;
  url: string;
}[] = [
  {
    sex: ["male"],
    part: PartEnum.FACE,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/male-head-front.webp",
  },
  {
    sex: ["male"],
    part: PartEnum.FACE,
    position: PositionEnum.RIGHT,
    url: "/assets/silhouettes/male-head-right.webp",
  },
  {
    sex: ["male"],
    part: PartEnum.FACE,
    position: PositionEnum.LEFT,
    url: "/assets/silhouettes/male-head-left.webp",
  },
  {
    sex: ["male"],
    part: PartEnum.HAIR,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/male-hair.webp",
  },
  {
    sex: ["male", "female"],
    part: PartEnum.MOUTH,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/mouth.webp",
  },
  {
    sex: ["male"],
    part: PartEnum.BODY,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/male-body-front.webp",
  },
  {
    sex: ["male"],
    part: PartEnum.BODY,
    position: PositionEnum.RIGHT,
    url: "/assets/silhouettes/male-body-right.webp",
  },
  {
    sex: ["male"],
    part: PartEnum.BODY,
    position: PositionEnum.LEFT,
    url: "/assets/silhouettes/male-body-left.webp",
  },
  {
    sex: ["male"],
    part: PartEnum.BODY,
    position: PositionEnum.BACK,
    url: "/assets/silhouettes/male-body-back.webp",
  },
  {
    sex: ["female"],
    part: PartEnum.FACE,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/female-head-front.webp",
  },
  {
    sex: ["female"],
    part: PartEnum.FACE,
    position: PositionEnum.RIGHT,
    url: "/assets/silhouettes/female-head-right.webp",
  },
  {
    sex: ["female"],
    part: PartEnum.FACE,
    position: PositionEnum.LEFT,
    url: "/assets/silhouettes/female-head-left.webp",
  },
  {
    sex: ["female"],
    part: PartEnum.HAIR,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/female-hair.webp",
  },
  {
    sex: ["female"],
    part: PartEnum.MOUTH,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/female-mouth.webp",
  },
  {
    sex: ["female"],
    part: PartEnum.BODY,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/female-body-front.webp",
  },
  {
    sex: ["female"],
    part: PartEnum.BODY,
    position: PositionEnum.RIGHT,
    url: "/assets/silhouettes/female-body-right.webp",
  },
  {
    sex: ["female"],
    part: PartEnum.BODY,
    position: PositionEnum.LEFT,
    url: "/assets/silhouettes/female-body-left.webp",
  },
  {
    sex: ["female"],
    part: PartEnum.BODY,
    position: PositionEnum.BACK,
    url: "/assets/silhouettes/female-body-back.webp",
  },
];
