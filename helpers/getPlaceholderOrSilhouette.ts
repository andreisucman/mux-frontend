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

  console.log("input pla", scanType, sex, type, part, position, data);

  if (scanType === "progress") {
    console.log("line 23");
    relevant = data.find(
      (item) =>
        item.sex.includes(sex) &&
        scanType === item.scanType &&
        item.type === type &&
        item.part === part &&
        item.position === position
    );
  } else {
    console.log("line 33");
    relevant = data.find(
      (item) =>
        item.sex.includes(sex) &&
        scanType === item.scanType &&
        item.type === type &&
        item.position === position
    );
  }

  console.log("relevant", relevant);

  return relevant;
}
