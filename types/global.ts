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
  overall: number;
  face: ProgressType | null;
  hair: ProgressType | null;
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
  hairStreak: number;
  clubFaceStreak: number;
  clubHairStreak: number;
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
  ids: { _id: string; startsAt: string; status: string; deletedOn?: string }[];
  name: string;
  key: string;
  icon: string;
  color: string;
  total: number;
  completed: number;
  concern: string;
  description: string;
  instruction: string;
};

export type PurchaseOverlayDataType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  part: string;
};

export enum RoutineStatusEnum {
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELED = "canceled",
}

export enum AuthRedirectToEnum {
  clubMemberRoutines = "clubMemberRoutines",
  clubMemberAbout = "clubMemberAbout",
  routines = "routines",
}

export type LatestScoresType = {
  overall: number;
  face: FormattedRatingType;
  hair: FormattedRatingType;
};

export type LatestScoresDifferenceType = {
  overall: number;
  face: { [key: string]: number };
  hair: { [key: string]: number };
};

export type PurchaseType = {
  _id: string;
  name: string;
  part: string;
  paid: number;
  paymentIntentId: string;
  subscriptionId?: string;
  contentEndDate: string;
  createdAt: Date;
  sellerId: string;
  sellerName: string;
  sellerAvatar: AvatarType | null;
  buyerId: string;
  buyerName: string;
  buyerAvatar: AvatarType | null;
  isDeactivated?: boolean;
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
}

export interface UserDataType extends DefaultUserType {
  _id?: string;
  email?: string | null;
  emailVerified?: boolean;
  auth?: string;
  name: string;
  avatar: AvatarType | null;
  country: string | null;
  club: ClubDataType | null;
  concerns: UserConcernType[];
  demographics: DemographicsType;
  toAnalyze: ToAnalyzeType[];
  streaks: StreaksType;
  subscriptions: UserSubscriptionsType;
  nextRoutine: NextActionType[];
  nextScan: NextActionType[];
  latestProgress: UserProgressRecordType;
  latestScores: LatestScoresType;
  latestScoresDifference: LatestScoresDifferenceType;
  tasks: TaskType[];
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

export type FormattedRatingType = {
  explanations?: { feature: string; explanation: string }[];
} & {
  [key: string]: number;
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
  recipe: RecipeType;
  productTypes: string[];
  isCreated?: boolean;
  proofId: string;
  examples: TaskExampleType[];
};
