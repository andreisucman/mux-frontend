import { ScanTypeEnum, SexEnum } from "@/types/global";

type Props = {
  scanType?: ScanTypeEnum;
  sex: SexEnum;
  type?: string;
  part?: string;
  position: string;
  data: any[];
};

export default function getPlaceholderOrSilhouette({
  scanType,
  sex,
  type,
  part,
  position,
  data,
}: Props) {
  let relevant;

  if (scanType === "progress") {
    relevant = data.find(
      (item) =>
        item.sex.includes(sex) &&
        scanType === item.scanType &&
        item.type === type &&
        item.part === part &&
        item.position === position
    );
  } else {
    relevant = data.find(
      (item) =>
        item.sex.includes(sex) &&
        scanType === item.scanType &&
        item.type === type &&
        item.position === position
    );
  }

  return relevant;
}
