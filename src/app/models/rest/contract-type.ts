export enum ContractType {
  None = "None",
  Veterinary = "Veterinary",
  Competitive = "Competitive"
}

export function allContractTypeDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(ContractType).forEach(x => {
    ret.push(StringToContractTypeDesc[x]);
  });
  return ret;
}
export function stringToContractType(data?: string): ContractType {
  if (data == null) {
    return ContractType.None;
  }

  return StringToContractType[data];
}
export function contractTypeToContractTypeDesc(contractType?: ContractType): string {
  return ContractTypeDesc[contractType ?? ContractType.None];
}
export const ContractTypeDesc: { [key in ContractType]: string } = {
  [ContractType.None]: "미지정",
  [ContractType.Veterinary]: "수의계약",
  [ContractType.Competitive]: "경쟁입찰",
}
export const StringToContractTypeDesc: { [key in string]: string } = {
  "None": "미지정",
  "Veterinary": "수의계약",
  "Competitive": "경쟁입찰",
}
export const StringToContractType: { [key in string]: ContractType } = {
  "None": ContractType.None,
  "Veterinary": ContractType.Veterinary,
  "Competitive": ContractType.Competitive,
}
export const ContactTypeDescToContactType: { [key in string]: ContractType } = {
  "미지정": ContractType.None,
  "수의계약": ContractType.Veterinary,
  "경쟁입찰": ContractType.Competitive,
}
