export enum PharmaGroup {
  None = "None",
  Recipient = "Recipient",
  Supplier = "Supplier",
  ETC = "ETC",
  Pharmaceutical = "Pharmaceutical",
}

export function allPharmaGroupDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(PharmaGroup).forEach(x => {
    ret.push(StringToPharmaGroupDesc[x]);
  });
  return ret;
}
export function stringToPharmaGroup(data?: string): PharmaGroup {
  if (data == null) {
    return PharmaGroup.None;
  }

  return StringToPharmaGroup[data];
}
export function pharmaGroupToPharmaGroupDesc(pharmaGroup?: PharmaGroup): string {
  return PharmaGroupDesc[pharmaGroup ?? PharmaGroup.None];
}
export const PharmaGroupDesc: { [key in PharmaGroup]: string } = {
  [PharmaGroup.None]: "미지정",
  [PharmaGroup.Recipient]: "공급받는자",
  [PharmaGroup.Supplier]: "공급사",
  [PharmaGroup.ETC]: "기타",
  [PharmaGroup.Pharmaceutical]: "정산제약사",
}
export const StringToPharmaGroupDesc: { [key in string]: string } = {
  "None": "미지정",
  "Recipient": "공급받는자",
  "Supplier": "공급사",
  "ETC": "기타",
  "Pharmaceutical": "정산제약사",
}
export const StringToPharmaGroup: { [key in string]: PharmaGroup } = {
  "None": PharmaGroup.None,
  "Recipient": PharmaGroup.Recipient,
  "Supplier": PharmaGroup.Supplier,
  "ETC": PharmaGroup.ETC,
  "Pharmaceutical": PharmaGroup.Pharmaceutical,
}
export const PharmaGroupDescToPharmaGroup: { [key in string]: PharmaGroup } = {
  "미지정": PharmaGroup.None,
  "공급받는자": PharmaGroup.Recipient,
  "공급사": PharmaGroup.Supplier,
  "기타": PharmaGroup.ETC,
  "정산제약사": PharmaGroup.Pharmaceutical,
}
