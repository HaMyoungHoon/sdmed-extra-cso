export enum BillType {
  None = "None",
  Unpublished = "Unpublished",
  Unit = "Unit",
  Monthly = "Monthly",
}

export function allBillTypeDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(BillType).forEach(x => {
    ret.push(StringToBillTypeDesc[x]);
  });
  return ret;
}
export function stringToBillType(data?: string): BillType {
  if (data == null) {
    return BillType.None;
  }

  return StringToBillType[data];
}
export function billTypeToBillTypeDesc(billType?: BillType): string {
  return BillTypeDesc[billType ?? BillType.None];
}
export const BillTypeDesc: { [key in BillType]: string } = {
  [BillType.None]: "미지정",
  [BillType.Unpublished]: "미발행",
  [BillType.Unit]: "건발행",
  [BillType.Monthly]: "월발행"
}
export const StringToBillTypeDesc: { [key in string]: string } = {
  "None": "미지정",
  "Unpublished": "미발행",
  "Unit": "건발행",
  "Monthly": "월발행"
}
export const StringToBillType: { [key in string]: BillType } = {
  "None": BillType.None,
  "Unpublished": BillType.Unpublished,
  "Unit": BillType.Unit,
  "Monthly": BillType.Monthly
}
export const BillTypeDescToBillType: { [key in string]: BillType } = {
  "미지정": BillType.None,
  "미발행": BillType.Unpublished,
  "건발행": BillType.Unit,
  "월발행": BillType.Monthly
}
