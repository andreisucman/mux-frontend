enum BackgroundTypeEnum {
  SOLID = "solid",
  GRADIENT_LINEAR = "gradientLinear",
}

export enum EarringsEnum {
  HOOP = "hoop",
  STUD = "stud",
}

export enum EarsEnum {
  ATTACHED = "attached",
  DETACHED = "detached",
}

export enum EyebrowsEnum {
  UP = "up",
  DOWN = "down",
  EYELASHES_UP = "eyelashesUp",
  EYELASHES_DOWN = "eyelashesDown",
}

export enum EyesEnum {
  EYES = "eyes",
  ROUND = "round",
  EYES_SHADOW = "eyesShadow",
  SMILING = "smiling",
  SMILING_SHADOW = "smilingShadow",
}

export enum FacialHairEnum {
  BEARD = "beard",
  SCRUFF = "scruff",
}

export enum GlassesEnum {
  ROUND = "round",
  SQUARE = "square",
}

export enum HairEnum {
  FONZE = "fonze",
  MRT = "mrT",
  DOUG_FUNNY = "dougFunny",
  MR_CLEAN = "mrClean",
  DANNY_PHANTOM = "dannyPhantom",
  FULL = "full",
  TURBAN = "turban",
  PIXIE = "pixie",
}

export enum MouthEnum {
  SURPRISED = "surprised",
  LAUGHING = "laughing",
  NERVOUS = "nervous",
  SMILE = "smile",
  SAD = "sad",
  PUCKER = "pucker",
  FROWN = "frown",
  SMIRK = "smirk",
}

export enum NoseEnum {
  CURVE = "curve",
  POINTED = "pointed",
  ROUND = "tound",
}

export enum ShirtEnum {
  OPEN = "open",
  CREW = "crew",
  COLLARED = "collared",
}

export type AvatarConfig = {
  seed?: string;
  flip?: boolean;
  rotate?: number;
  scale?: number;
  radius?: number;
  size?: number;
  backgroundColor?: string[];
  backgroundType?: BackgroundTypeEnum[];
  backgroundRotation?: number[];
  translateX?: number;
  translateY?: number;
  clip?: boolean;
  randomizeIds?: boolean;
  base?: "standard"[];
  baseColor?: string[];
  earringColor?: string[];
  earrings?: EarringsEnum[];
  earringsProbability?: number;
  ears?: EarsEnum[];
  eyeShadowColor?: string[];
  eyebrows?: EyebrowsEnum[];
  eyebrowsColor?: string[];
  eyes?: EyesEnum[];
  eyesColor?: string[];
  facialHair?: FacialHairEnum[];
  facialHairColor?: string[];
  facialHairProbability?: number;
  glasses?: GlassesEnum[];
  glassesColor?: string[];
  glassesProbability?: number;
  hair?: HairEnum[];
  hairColor?: string[];
  hairProbability?: number;
  mouth?: MouthEnum[];
  mouthColor?: string[];
  nose?: NoseEnum[];
  shirt?: ShirtEnum[];
  shirtColor?: string[];
};
