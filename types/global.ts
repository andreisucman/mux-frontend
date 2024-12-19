import { RequirementType } from "@/components/UploadCarousel/types";
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
  socials: { value: string; label: string }[];
};

export type ClubDataType = {
  followingUserId: string;
  followingUserName: string;
  bio: ClubBioType;
  payouts: {
    connectId: string;
    rewardEarned: number;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
    disabledReason: string;
  };
  privacy: HeadValuePartsBoolean;
  nextAvatarUpdateAt: Date | null;
  nextNameUpdateAt: Date | null;
  totalFollowers: number;
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
  MOUTH = "mouth",
  SCALP = "scalp",
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
};

export type UserProgressRecordType = {
  head: {
    overall: number;
    face: ProgressType | null;
    mouth: ProgressType | null;
    scalp: ProgressType | null;
  };
  body: { overall: number; body: ProgressType | null };
};

export type UserLatestStyleAnalysis = {
  head: StyleAnalysisType | null;
  body: StyleAnalysisType | null;
};

export type HigherThanType = {
  head: { overall: number; face: number; mouth: number; scalp: number };
  body: { overall: number; body: number };
};

export type UserConcernType = {
  name: string;
  type: TypeEnum;
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
  healthStreak: number;
  clubFaceStreak: number;
  clubMouthStreak: number;
  clubScalpStreak: number;
  clubBodyStreak: number;
  clubHealthStreak: number;
};

export type RoutineType = {
  _id: string;
  userId: string;
  type: string;
  concerns: UserConcernType[];
  finalSchedule: { [key: string]: any };
  status: RoutineStatusEnum;
  createdAt: string;
  allTasks: AllTaskType[];
};

export type AllTaskType = {
  name: string;
  description: string;
  instruction: string;
  key: string;
  icon: string;
  color: string;
  total: number;
  completed: number;
  unknown: number;
  concern: string;
};

export enum RoutineStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
  REPLACED = "replaced",
}

export enum AuthRedirectToEnum {
  clubMemberRoutines = "clubMemberRoutines",
  clubMemberAbout = "clubMemberAbout",
  routines = "routines",
}

export interface UserDataType extends DefaultUserType {
  _id?: string;
  email?: string | null;
  emailVerified?: boolean;
  auth?: string;
  name: string;
  avatar: { [key: string]: any };
  country: string | null;
  club: ClubDataType | null;
  concerns: UserConcernType[];
  demographics: DemographicsType;
  requiredProgress: {
    head: RequirementType[];
    body: RequirementType[];
  };
  styleRequirements: {
    head: RequirementType[];
    body: RequirementType[];
  };
  toAnalyze: {
    head: ToAnalyzeType[];
    body: ToAnalyzeType[];
  };
  streaks: StreaksType;
  subscriptions: UserSubscriptionsType;
  nextScan: NextActionType[];
  nextRoutine: NextActionType[];
  potential: UserPotentialRecordType;
  latestProgress: UserProgressRecordType;
  latestStyleAnalysis: UserLatestStyleAnalysis;
  currentlyHigherThan: HigherThanType;
  potentiallyHigherThan: HigherThanType;
  latestScores: LatestScoresType;
  latestScoresDifference: LatestScoresType;
  tasks: TaskType[];
  routines: RoutineType[];
  coachEnergy: number;
  remainingCaloriesPerDay: number;
  deleteOn: Date | null;
  canRejoinClubAfter: Date | null;
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
  analyst: SubscriptionType;
};

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

export type StyleAnalysisType = {
  _id: string;
  userId: string;
  createdAt: string;
  compareDate: string;
  mainUrl: BlurredUrlType;
  compareMainUrl: BlurredUrlType;
  urls: BlurredUrlType[];
  compareUrls: BlurredUrlType[];
  votes: number;
  compareVotes: number;
  demographics: DemographicsType;
  type: TypeEnum;
  goal: StyleGoalsType | null;
  hash: string;
  styleName: string;
  compareStyleName: string;
  currentDescription: string;
  currentSuggestion: string;
  matchSuggestion: string;
  isPublic: boolean;
  latestHeadScoreDifference: number;
  latestBodyScoreDifference: number;
  analysis: { [key: string]: number } | null;
  compareAnalysis: { [key: string]: number } | null;
  userName: string | null;
  avatar: { [key: string]: any } | null;
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

export enum ScanTypeEnum {
  PROGRESS = "progress",
  STYLE = "style",
  HEALTH = "health",
  FOOD = "food",
}

export type NextActionType = {
  type: TypeEnum;
  date: Date | null;
  parts: { part: PartEnum; date: Date | null }[];
};

export enum TaskStatusErum {
  ACTIVE = "active",
  COMPLETED = "completed",
  EXPIRED = "expired",
  CANCELED = "canceled",
}

export type RecipeType = {
  name: string;
  image: string;
  calories: number;
  description: string;
  instruction: string;
  canPersonalize: boolean;
};

export type SuggestionType = {
  itemId: string;
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
  reasoning: string;
  analysisResult: { [key: string]: boolean };
  key: string;
};

export type RequiredSubmissionType = {
  submissionId: string;
  name: string;
  proofId: string;
  dayTime?: "morning" | "noon" | "evening";
  isSubmitted: boolean;
};

export type TaskType = {
  _id: string;
  name: string;
  key: string;
  icon: string;
  color: string;
  type: string;
  startsAt: string;
  expiresAt: string;
  routineId: string;
  requisite: string;
  description: string;
  instruction: string;
  proofEnabled: boolean;
  status: TaskStatusErum;
  isRecipe: boolean;
  recipe: RecipeType;
  suggestions: SuggestionType[];
  productsPersonalized: boolean;
  requiredSubmissions?: RequiredSubmissionType[];
  example: { type: string; url: string };
  defaultSuggestions: SuggestionType[];
};

export type LatestScoresType = {
  head: {
    overall: number;
    face: number;
    mouth: number;
    scalp: number;
  } | null;
  body: { overall: number; body: number } | null;
};
