import React from "react";
import { BlurDotType } from "@/components/UploadCard/types";
import { ToAnalyzeType } from "@/types/global";

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
  onCompleteCb: (lastImage: ToAnalyzeType) => void;
  setDisplayComponent: React.Dispatch<React.SetStateAction<any>>;
};
