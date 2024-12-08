export type FilterItemType = {
  label: string;
  value: string;
  types?: string[];
  parts?: string[];
  disabled?: boolean;
};

export type FilterPartItemType = {
  label: string;
  value: string;
  type: string;
};
