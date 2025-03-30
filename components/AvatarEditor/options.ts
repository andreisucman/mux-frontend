import {
  EarringsEnum,
  EarsEnum,
  EyebrowsEnum,
  EyesEnum,
  FacialHairEnum,
  GlassesEnum,
  HairEnum,
  MouthEnum,
  NoseEnum,
  ShirtEnum,
} from "./types";

export const options = {
  hair: [
    { label: "Fonze", value: HairEnum.FONZE },
    { label: "MRT", value: HairEnum.MRT },
    { label: "Dough funny", value: HairEnum.DOUG_FUNNY },
    { label: "Mr. Clean", value: HairEnum.MR_CLEAN },
    { label: "Danny Phantom", value: HairEnum.DANNY_PHANTOM },
    { label: "Full", value: HairEnum.FULL },
    { label: "Turban", value: HairEnum.TURBAN },
    { label: "Pixie", value: HairEnum.PIXIE },
  ],
  ears: [
    { label: "Attached", value: EarsEnum.ATTACHED },
    { label: "Detached", value: EarsEnum.DETACHED },
  ],
  earrings: [
    { label: "Hoop", value: EarringsEnum.HOOP },
    { label: "Stud", value: EarringsEnum.STUD },
  ],
  eyebrows: [
    { label: "Up", value: EyebrowsEnum.UP },
    { label: "Down", value: EyebrowsEnum.DOWN },
    { label: "Eyelashes up", value: EyebrowsEnum.EYELASHES_UP },
    { label: "Eyelashes down", value: EyebrowsEnum.EYELASHES_DOWN },
  ],
  eyes: [
    { label: "Normal", value: EyesEnum.EYES },
    { label: "Round", value: EyesEnum.ROUND },
    { label: "Smiling", value: EyesEnum.SMILING },
  ],
  nose: [
    { label: "Curve", value: NoseEnum.CURVE },
    { label: "Pointed", value: NoseEnum.POINTED },
    { label: "Round", value: NoseEnum.ROUND },
  ],
  mouth: [
    { label: "Surprized", value: MouthEnum.SURPRISED },
    { label: "Laughing", value: MouthEnum.LAUGHING },
    { label: "Nervous", value: MouthEnum.NERVOUS },
    { label: "Smile", value: MouthEnum.SMILE },
    { label: "Sad", value: MouthEnum.SAD },
    { label: "Pucker", value: MouthEnum.PUCKER },
    { label: "Frown", value: MouthEnum.FROWN },
    { label: "Smirk", value: MouthEnum.SMIRK },
  ],
  shirt: [
    { label: "Open", value: ShirtEnum.OPEN },
    { label: "Crew", value: ShirtEnum.CREW },
    { label: "Collared", value: ShirtEnum.COLLARED },
  ],
};
