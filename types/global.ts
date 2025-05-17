import { AvatarConfig } from "@/components/AvatarEditor/types";

export type DefaultUserType = {
  timeZone: string;
  tosAccepted: boolean;
  specialConsiderations: string;
};

type BalanceRecordType = {
  amount: number;
  currency: string;
};

export type ClubDataType = {
  isActive: boolean;
  intro: string;
  socials: { value: string | null; label: string }[];
  payouts: {
    connectId: string;
    balance: { pending: BalanceRecordType; available: BalanceRecordType };
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
    disabledReason: string;
  };
  nextAvatarUpdateAt: Date | null;
  nextNameUpdateAt: Date | null;
};

export type ClubUserType = {
  name?: string;
  intro?: string;
  socials: { value: string | null; label: string }[];
  avatar?: AvatarType | null;
  latestScoresDifference?: LatestScoresDifferenceType;
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
  name: "original" | "blurred";
  url: string;
};

export type ToAnalyzeType = {
  createdAt: Date;
  mainUrl: BlurredUrlType;
  updateUrl: BlurredUrlType;
  contentUrlTypes: BlurredUrlType[];
  position: string;
  part: PartEnum | null;
};

export type UserProgressRecordType = {
  face: ProgressType | null;
  hair: ProgressType | null;
  body: ProgressType | null;
};

export type UserConcernType = {
  name: string;
  part: PartEnum;
};

export type StreaksType = {
  faceStreak: number;
  hairStreak: number;
};

export type RoutineType = {
  _id: string;
  userId: string;
  type: string;
  part: string;
  concerns: string[];
  status: RoutineStatusEnum;
  startsAt: string;
  lastDate: string;
  deletedOn?: Date;
  allTasks: AllTaskType[];
};

export type AllTaskType = {
  ids: { _id: string; startsAt: string; status: string; deletedOn?: string }[];
  name: string;
  key: string;
  icon: string;
  color: string;
  completed: number;
  concern: string;
};

export type RoutineDataStatsType = {
  routines: number;
  completedTasks: number;
  completedTasksWithProof: number;
  diaryRecords: number;
};

export type PurchaseOverlayDataType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  concern: string;
  part: string;
  stats: RoutineDataStatsType;
};

export enum RoutineStatusEnum {
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELED = "canceled",
}

export type ScoreType = {
  value: number;
  explanation: string;
  name: string;
};

export type LatestScoresType = {
  [key: string]: ScoreType[];
};

export type ScoreDifferenceType = {
  value: number;
  name: string;
};

export type LatestScoresDifferenceType = {
  [key: string]: ScoreDifferenceType[];
};

export type ViewType = {
  _id: string;
  part: string;
  concern: string;
  earned: number;
  views: number;
};

export type BuyerType = {
  _id: string;
  name: string;
  part: string;
  paid: number;
  isSubscribed: boolean;
  createdAt: Date;
  buyerId: string;
  buyerName: string;
  buyerAvatar: { [key: string]: any };
};

export type AvatarType = {
  config: AvatarConfig;
  image: string;
};

export enum PartEnum {
  FACE = "face",
  HAIR = "hair",
  BODY = "body",
}

export type LatestProgressImagesType = {
  [key: string]: ProgressImageType[];
};

export interface UserDataType extends DefaultUserType {
  _id?: string;
  email?: string | null;
  emailVerified?: boolean;
  isPublic?: boolean;
  auth?: string;
  name: string;
  avatar: AvatarType | null;
  country: string | null;
  club: ClubDataType | null;
  concerns: UserConcernType[];
  demographics: DemographicsType;
  toAnalyze: ToAnalyzeType[];
  streaks: StreaksType;
  nextRoutineSuggestion: NextActionType[];
  nextRoutine: NextActionType[];
  nextScan: NextActionType[];
  latestProgressImages: LatestProgressImagesType;
  latestConcernScores: LatestScoresType;
  latestConcernScoresDifference: LatestScoresDifferenceType;
  deleteOn: Date | null;
  canRejoinClubAfter: Date | null;
}

export type SubscriptionType = {
  isTrialUsed: boolean;
  subscriptionId: string | null;
  validUntil: Date | null;
};

export enum AnalysisStatusEnum {
  ROUTINE = "routine",
  ANALYSIS = "analysis",
  ROUTINE_SUGGESTION = "routineSuggestion",
}

export type ProgressImageType = {
  mainUrl: BlurredUrlType;
  urls: BlurredUrlType[];
};

export type ProgressType = {
  _id: string;
  userId: string;
  part: PartEnum;
  sex?: SexEnum;
  createdAt: string;
  initialDate: string;
  images: ProgressImageType[];
  initialImages: ProgressImageType[];
  concernScores: ScoreType[];
  concernScoresDifference: ScoreDifferenceType[];
  explanation: string;
  specialConsiderations: string | null;
  avatar?: { [key: string]: string };
  userName?: string;
  isPublic: boolean;
};

export type BeforeAfterType = {
  initialDate: string;
  updatedAt: string;
  demographics: DemographicsType;
  images: ProgressImageType[];
  initialImages: ProgressImageType[];
  concernScore?: ScoreType;
  concernScoreDifference?: ScoreDifferenceType;
  featureScores?: ScoreType[];
  featureScoresDifference?: ScoreDifferenceType[];
  isPublic: boolean;
  concern: string;
  avatar?: { [key: string]: any };
  userName?: string;
  routineName?: string;
  part: PartEnum;
};

export enum SexEnum {
  MALE = "male",
  FEMALE = "female",
}

export type NextActionType = { part: PartEnum; date: Date | null };

export enum TaskStatusEnum {
  ACTIVE = "active",
  COMPLETED = "completed",
  EXPIRED = "expired",
  CANCELED = "canceled",
}

export type RecipeType = {
  name: string;
  productTypes: string[];
  examples: { type: string; url: string }[];
  description: string;
  instruction: string;
  canPersonalize: boolean;
};

export type TaskExampleType = { type: string; url: string };

export type TaskType = {
  _id: string;
  name: string;
  key: string;
  icon: string;
  color: string;
  part: string;
  concern: string;
  startsAt: string;
  completedAt: string;
  expiresAt: string;
  routineId: string;
  requisite: string;
  description: string;
  instruction: string;
  proofEnabled: boolean;
  status: TaskStatusEnum;
  isDish: boolean;
  previousRecipe: RecipeType;
  productTypes: string[];
  isCreated?: boolean;
  proofId: string;
  requiresProof: boolean;
  examples: TaskExampleType[];
};
