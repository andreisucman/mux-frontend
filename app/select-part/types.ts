import { BlurDotType } from "@/components/UploadCard/types";

export type OffsetType = {
  scaleHeight: number;
  scaleWidth: number;
};

export type UploadProgressProps = {
  url: string;
  beforeImageUrl?: string;
  part: string | null;
  blurDots: BlurDotType[];
  offsets: OffsetType;
};
