export type StyleGoalsType = {
  name: string;
  description: string;
  icon: string;
};

export interface ImageCheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange: (newValue: StyleGoalsType) => void;
  name: string;
  description: string;
  icon: string;
}
