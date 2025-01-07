export enum UserFileType {
  Taxpayer = "Taxpayer",
  BankAccount = "BankAccount",
  CsoReport = "CsoReport",
  MarketingContract = "MarketingContract"
}

export function allUserFileTypeDesc(): string[] {
  const ret: string[] = [];
  Object.keys(UserFileType).forEach(x => {
    ret.push(StringToFileTypeDesc[x]);
  });
  return ret;
}
export const StringToFileTypeDesc: { [key in string]: string } = {
  "Taxpayer": "사업자등록증",
  "BankAccount": "은행계좌",
  "CsoReport": "CSO 신고증",
  "MarketingContract": "마케팅 계약서"
}
export const FileTypeToFileTypeDesc: { [key in UserFileType]: string } = {
  [UserFileType.Taxpayer]: "사업자등록증",
  [UserFileType.BankAccount]: "은행계좌",
  [UserFileType.CsoReport]: "CSO 신고증",
  [UserFileType.MarketingContract]: "마케팅 계약서"
}
