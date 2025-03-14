import { RequirementType } from "@/components/UploadContainer/types";
import { PartEnum } from "@/context/ScanPartsChoicesContext/types";

export type DefaultUserType = {
  timeZone: string;
  tosAccepted: boolean;
  specialConsiderations: string;
};

export type HeadValuePartsBoolean = {
  name: string;
  value: boolean;
  parts: { name: string; value: boolean }[];
}[];

export type ClubDataType = {
  followingUserId: string;
  followingUserName: string;
  intro: string;
  socials: { value: string | null; label: string }[];
  payouts: {
    connectId: string;
    balance: number;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
    disabledReason: string;
  };
  privacy: HeadValuePartsBoolean;
  nextAvatarUpdateAt: Date | null;
  nextNameUpdateAt: Date | null;
};

export type ClubUserType = {
  name?: string;
  intro?: string;
  socials: { value: string | null; label: string }[];
  avatar?: { [key: string]: any };
  latestScoresDifference?: LatestScoresDifferenceType;
};

export type DemographicsType = {
  sex: SexEnum;
  skinColor: SkinColorEnum;
  ethnicity: EthnicityEnum;
  ageInterval: AgeIntervalEnum;
};

export enum PositionEnum {
  FRONT = "front",
  BACK = "back",
  RIGHT = "right",
  LEFT = "left",
}

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
  createdAt: Date;
  mainUrl: BlurredUrlType;
  contentUrlTypes: BlurredUrlType[];
  position: string;
  part: PartEnum | null;
};

export type UserPotentialRecordType = {
  overall: number;
  face: FormattedRatingType | null;
  mouth: FormattedRatingType | null;
  scalp: FormattedRatingType | null;
  body: FormattedRatingType | null;
};

export type UserProgressRecordType = {
  overall: number;
  face: ProgressType | null;
  mouth: ProgressType | null;
  scalp: ProgressType | null;
  body: ProgressType | null;
};

export type UserConcernType = {
  name: string;
  part: PartEnum;
  explanation: string;
  importance: number;
  isDisabled: boolean;
};

export type StreaksType = {
  faceStreak: number;
  mouthStreak: number;
  scalpStreak: number;
  bodyStreak: number;
  clubFaceStreak: number;
  clubMouthStreak: number;
  clubScalpStreak: number;
  clubBodyStreak: number;
};

export type RoutineType = {
  _id: string;
  userId: string;
  type: string;
  part: string;
  concerns: UserConcernType[];
  finalSchedule: { [key: string]: any };
  status: RoutineStatusEnum;
  startsAt: string;
  lastDate: string;
  allTasks: AllTaskType[];
};

export type AllTaskType = {
  ids: { _id: string; startsAt: string; status: string }[];
  name: string;
  key: string;
  icon: string;
  color: string;
  total: number;
  completed: number;
  concern: string;
};

export type PurchaseOverlayDataType = {
  name: string;
  description: string;
  oneTimePrice: number;
  part: string;
};

export enum RoutineStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum AuthRedirectToEnum {
  clubMemberRoutines = "clubMemberRoutines",
  clubMemberAbout = "clubMemberAbout",
  routines = "routines",
}

export type LatestScoresType = {
  overall: number;
  face: FormattedRatingType;
  mouth: FormattedRatingType;
  scalp: FormattedRatingType;
  body: FormattedRatingType;
};

export type LatestScoresDifferenceType = {
  overall: number;
  face: { [key: string]: number };
  mouth: { [key: string]: number };
  scalp: { [key: string]: number };
  body: { [key: string]: number };
};

export type PurchaseType = {
  _id: string;
  name: string;
  part: string;
  paid: number;
  isSubscribed: boolean;
  transactionId: string;
  createdAt: Date;
  sellerId: string;
  sellerName: string;
  sellerAvatar: { [key: string]: any };
  buyerId: string;
  buyerName: string;
  buyerAvatar: { [key: string]: any };
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

type UserPurchaseType = {
  sellerId: string;
  part: string;
  isSubscribed: boolean;
};

export interface UserDataType extends DefaultUserType {
  _id?: string;
  email?: string | null;
  emailVerified?: boolean;
  auth?: string;
  name: string;
  avatar: { [key: string]: any };
  country: string | null;
  club: ClubDataType | null;
  scanAnalysisQuota: number;
  concerns: UserConcernType[];
  demographics: DemographicsType;
  requiredProgress: RequirementType[];
  toAnalyze: ToAnalyzeType[];
  streaks: StreaksType;
  subscriptions: UserSubscriptionsType;
  nextScan: NextActionType[];
  nextRoutine: NextActionType[];
  latestScanImages?: string[];
  potential: UserPotentialRecordType;
  latestProgress: UserProgressRecordType;
  latestScores: LatestScoresType;
  latestScoresDifference: LatestScoresDifferenceType;
  tasks: TaskType[];
  routines: RoutineType[];
  coachEnergy: number;
  purchases: UserPurchaseType[];
  nutrition: {
    dailyCalorieGoal: number | null;
    recommendedDailyCalorieGoal: number | null;
    remainingDailyCalories: number | null;
  };
  deleteOn: Date | null;
  canRejoinClubAfter: Date | null;
  nextDiaryRecordAfter: { [key: string]: Date | null } | null;
}

export type SubscriptionType = {
  isTrialUsed: boolean;
  subscriptionId: string | null;
  validUntil: Date | null;
};

export type UserSubscriptionsType = {
  improvement: SubscriptionType;
  peek: SubscriptionType;
  advisor: SubscriptionType;
};

export type ProgressImageType = {
  position: string;
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
  scores: FormattedRatingType;
  scoresDifference: { [key: string]: any };
  explanation: string;
  specialConsiderations: string | null;
  avatar?: { [key: string]: string };
  userName?: string;
  isPublic: boolean;
};

export interface BeforeAfterType extends ProgressType {
  updatedAt: string;
}

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

export enum SexEnum {
  MALE = "male",
  FEMALE = "female",
}

export enum ScanTypeEnum {
  PROGRESS = "progress",
  FOOD = "food",
}

export type NextActionType = { part: PartEnum; date: Date | null };

export enum TaskStatusEnum {
  ACTIVE = "active",
  COMPLETED = "completed",
  EXPIRED = "expired",
  CANCELED = "canceled", // when a user cancels a task
  INACTIVE = "inactive", // when a user changes the routine
  DELETED = "deleted",
}

export type RecipeType = {
  name: string;
  image: string;
  description: string;
  instruction: string;
  canPersonalize: boolean;
};

export type SuggestionType = {
  _id: string;
  asin: string;
  name: string;
  url: string;
  type: "product" | "place";
  image: string;
  description: string;
  rating: number;
  suggestion: string;
  variant: string;
  rank: number;
  intro: string;
  priceAndUnit: string;
  productFeatures: string[];
};

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
  recipe: RecipeType;
  suggestions: SuggestionType[];
  productTypes: string[];
  isCreated?: boolean;
  proofId: string;
  example: { type: string; url: string };
};
