import { UploadProgressProps } from "@/app/scan/types";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { PartEnum } from "@/context/UploadPartsChoicesContext/types";
import { PositionEnum, ScanTypeEnum, TypeEnum, UserDataType } from "@/types/global";

export type RequirementType = {
  title: string;
  instruction: string;
  type: TypeEnum;
  part: PartEnum;
  position: PositionEnum;
};

export type CreateSlidesProps = {
  userDetails: UserDataType;
  type: TypeEnum;
  scanType: ScanTypeEnum;
  position: PositionEnum;
  requirements: RequirementType[];
  faceBlurredUrl: string;
  eyesBlurredUrl: string;
  localUrl: string;
  progress: number;
  isLoading: boolean;
  originalUrl: string;
  blurType: BlurTypeEnum;
  showFace: boolean;
  showMouth: boolean;
  showScalp: boolean;
  uploadProgress: (args: UploadProgressProps) => Promise<void>;
  setEyesBlurredUrl: React.Dispatch<React.SetStateAction<string>>;
  setFaceBlurredUrl: React.Dispatch<React.SetStateAction<string>>;
  setLocalUrl: React.Dispatch<React.SetStateAction<string>>;
  setOriginalUrl: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteImage: () => void;
};
