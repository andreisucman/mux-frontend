export type FoodAnalysisType = {
  share: number;
  foodName: string;
  shouldEat: boolean;
  amount: number;
  energy: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  explanation: string;
};

export type FoodAnalysisResponseType = {
  _id: string;
  url: string;
  analysis: FoodAnalysisType;
};
