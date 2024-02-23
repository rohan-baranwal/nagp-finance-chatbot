import { QueryActions } from "./query-actions.enum";

const goBackTo = "go-back-to-";
export enum GoBackTo {
  MainChoice = `${goBackTo}${QueryActions.MainChoice}`,
  FundExplorer = `${goBackTo}${QueryActions.FundExplorer}`,
  FundSubCategory = `${goBackTo}${QueryActions.FundSubCategory}`,
  ChooseFunds = `${goBackTo}${QueryActions.ChooseFunds}`,
}