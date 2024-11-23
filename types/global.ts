import { PartEnum } from "@/context/UploadPartsChoicesContext/types";

export type DefaultUserType = {
  timeZone: string;
  fingerprint: number;
  tosAccepted: boolean;
  specialConsiderations: string;
};

export type HeadValuePartsBoolean = {
  name: string;
  value: boolean;
  parts: { name: string; value: boolean }[];
}[];

type ClubBioType = {
  intro: string;
  philosophy: string;
  style: string;
  tips: string;
  about: string;
  questions: { asking: string; question: string }[];
};

export type ClubDataType = {
  trackedUserId: string;
  name: string;
  avatar: { [key: string]: any };
  isActive: boolean;
  bio: ClubBioType;
  payouts: {
    connectId: string;
    rewardEarned: number;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
    disabledReason: string;
  };
  privacy: HeadValuePartsBoolean;
};

export type ClubUserType = {
  // if the user joined the club all of these fields must be populated with default empty values else the whole field is null
  _id: string;
  avatar: { [key: string]: any };
  name: string;
  bio: ClubBioType;
  scores: {
    headCurrentScore: number;
    headTotalProgress: number;
    bodyCurrentScore: number;
    bodyTotalProgress: number;
  };
};

export type ProgressRequirement = {
  title: string;
  instruction: string;
  type: TypeEnum;
  part: PartEnum;
  position: "front" | "back" | "right" | "left" | "mouth" | "scalp";
};

export type DemographicsType = {
  sex: SexEnum;
  skinColor: SkinColorEnum;
  ethnicity: EthnicityEnum;
  ageInterval: AgeIntervalEnum;
};

export enum EthnicityEnum {
  WHITE = "white",
  ASIAN = "asian",
  BLACK = "black",
  HISPANIC = "hispanic",
  ARAB = "arab",
  SOUTH_ASIAN = "south_asian",
  NATIVE_AMERICAN = "native_american",
}

export enum SkinColorEnum {
  TYPE1 = "fitzpatrick_1",
  TYPE2 = "fitzpatrick_2",
  TYPE3 = "fitzpatrick_3",
  TYPE4 = "fitzpatrick_4",
  TYPE5 = "fitzpatrick_5",
  TYPE6 = "fitzpatrick_6",
}

export enum AgeIntervalEnum {
  "18-24" = "18-24",
  "24-30" = "24-30",
  "30-36" = "30-36",
  "36-42" = "36-42",
  "42-48" = "42-48",
  "48-56" = "48-56",
  "56-64" = "56-64",
  "64+" = "64+",
}

export type BlurredUrlType = {
  name: "original" | "eyes" | "face";
  url?: string;
};

export type ToAnalyzeType = {
  type: TypeEnum | null;
  createdAt: Date;
  mainUrl: BlurredUrlType;
  contentUrlTypes: BlurredUrlType[];
  position: string;
  part: PartEnum | null;
};

export type UserPotentialRecordType = {
  head: {
    overall: number;
    face: FormattedRatingType | null;
    mouth: FormattedRatingType | null;
    scalp: FormattedRatingType | null;
  };
  body: { overall: number; body: FormattedRatingType | null };
  health: { overall: number; health: FormattedRatingType | null };
};

export type UserProgressRecordType = {
  head: {
    overall: number;
    face: ProgressType | null;
    mouth: ProgressType | null;
    scalp: ProgressType | null;
  };
  body: { overall: number; body: ProgressType | null };
  health: { overall: number; health: ProgressType | null };
};

export type UserLatestStyleAnalysis = {
  head: StyleAnalysisType | null;
  body: StyleAnalysisType | null;
};

export type HigherThanType = {
  head: { overall: number; face: number; mouth: number; scalp: number };
  body: { overall: number; body: number };
  health: { overall: number; health: number };
};

export type UserConcernType = {
  name: string;
  type: TypeEnum;
  part: PartEnum;
  explanation: string;
  importance: number;
  isDisabled: boolean;
};

export interface UserDataType extends DefaultUserType {
  _id?: string;
  email: string | null;
  club: ClubDataType | null;
  concerns: UserConcernType[];
  requiredProgress: {
    head: ProgressRequirement[] | null;
    body: ProgressRequirement[] | null;
    health: ProgressRequirement[] | null;
  };
  demographics: DemographicsType;
  toAnalyze: {
    head: ToAnalyzeType[];
    body: ToAnalyzeType[];
    health: ToAnalyzeType[];
  };
  potential: UserPotentialRecordType;
  latestProgress: UserProgressRecordType;
  latestStyleAnalysis: UserLatestStyleAnalysis;
  currentlyHigherThan: HigherThanType;
  potentiallyHigherThan: HigherThanType;
}

export type ProgressImageType = {
  position: string;
  mainUrl: BlurredUrlType;
  urls: BlurredUrlType[];
};

export type ProgressType = {
  _id: string;
  userId: string;
  type: TypeEnum;
  part: PartEnum;
  sex?: SexEnum;
  createdAt: string;
  initialDate: string;
  images: ProgressImageType[];
  initialImages: ProgressImageType[];
  scores: { [key: string]: any };
  scoresDifference: { [key: string]: any };
  explanation: string;
  specialConsiderations: string | null;
  avatar?: { [key: string]: string };
  clubName?: string;
  isPublic: boolean;
};

export type StyleGoalsType = {
  name: string;
  description: string;
  icon: string;
};

export type FormattedRatingType = {
  explanations?: { feature: string; explanation: string }[];
} & {
  [key: string]: number;
};

export type StyleAnalysisType = {
  _id: string;
  userId: string;
  color: string;
  mainUrl: BlurredUrlType;
  urls: BlurredUrlType[];
  demographics: DemographicsType;
  type: TypeEnum;
  goal: StyleGoalsType;
  verdict?: string;
  createdAt: string;
  currentDescription?: string;
  currentSuggestion?: string;
  matchSuggestion?: string;
  isPublic?: boolean;
  clubName?: string;
  scores?: { [key: string]: number };
  avatar?: { [key: string]: any };
  latestFaceScoreDifference?: number;
  latestBodyScoreDifference?: number;
};

export enum SexEnum {
  MALE = "male",
  FEMALE = "female",
}

export enum TypeEnum {
  HEAD = "head",
  BODY = "body",
  HEALTH = "health",
}
