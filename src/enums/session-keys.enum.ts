import { QueryActions } from "./query-actions.enum";

const session = "sesssion.";
export enum SessionKeys {
  MainChoice = `${session}${QueryActions.MainChoice}`,
  FundExplorer = `${session}${QueryActions.FundExplorer}`,
  FundSubCategory = `${session}${QueryActions.FundSubCategory}`,
  ChooseFunds = `${session}${QueryActions.ChooseFunds}`,
  PhoneNumber = `${session}${QueryActions.PhoneNumber}`,
}