export type DefaultUserType = {
  timeZone: string;
  fingerprint: number;
  tosAccepted: boolean;
  specialConsiderations: string;
  demographics: { sex: SexEnum } | null;
};

export interface UserDataType extends DefaultUserType {
  email: string | null;
}

export enum SexEnum {
  MALE = "male",
  FEMALE = "female",
}
