import { PartEnum } from "@/context/ScanPartsChoicesContext/types";
import { PositionEnum, ScanTypeEnum } from "@/types/global";

export const silhouettes: {
  sex: string[];
  scanType: ScanTypeEnum;
  part?: PartEnum;
  position?: PositionEnum;
  url: string;
}[] = [
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.FACE,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/male-head-front.webp",
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.FACE,
    position: PositionEnum.RIGHT,
    url: "/assets/silhouettes/male-head-right.webp",
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.FACE,
    position: PositionEnum.LEFT,
    url: "/assets/silhouettes/male-head-left.webp",
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.HAIR,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/male-hair.webp",
  },
  {
    sex: ["male", "female"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.MOUTH,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/mouth.webp",
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.BODY,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/male-body-front.webp",
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.BODY,
    position: PositionEnum.RIGHT,
    url: "/assets/silhouettes/male-body-right.webp",
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.BODY,
    position: PositionEnum.LEFT,
    url: "/assets/silhouettes/male-body-left.webp",
  },
  {
    sex: ["male"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.BODY,
    position: PositionEnum.BACK,
    url: "/assets/silhouettes/male-body-back.webp",
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.FACE,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/female-head-front.webp",
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.FACE,
    position: PositionEnum.RIGHT,
    url: "/assets/silhouettes/female-head-right.webp",
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.FACE,
    position: PositionEnum.LEFT,
    url: "/assets/silhouettes/female-head-left.webp",
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.HAIR,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/female-hair.webp",
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.MOUTH,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/female-mouth.webp",
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.BODY,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/female-body-front.webp",
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.BODY,
    position: PositionEnum.RIGHT,
    url: "/assets/silhouettes/female-body-right.webp",
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.BODY,
    position: PositionEnum.LEFT,
    url: "/assets/silhouettes/female-body-left.webp",
  },
  {
    sex: ["female"],
    scanType: ScanTypeEnum.PROGRESS,
    part: PartEnum.BODY,
    position: PositionEnum.BACK,
    url: "/assets/silhouettes/female-body-back.webp",
  },
  {
    sex: ["male", "female"],
    scanType: ScanTypeEnum.FOOD,
    position: PositionEnum.FRONT,
    url: "/assets/silhouettes/plate.webp",
  },
];
