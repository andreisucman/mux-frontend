export type RewardCardType = {
  _id: string;
  key: string;
  title: string;
  icon: string;
  condition: string;
  iconKey: string;
  isActive: boolean;
  value: number;
  requisite: { [key: string]: number };
  count: number;
  left: number;
  renewsOn: string;
  sign: number;
};
