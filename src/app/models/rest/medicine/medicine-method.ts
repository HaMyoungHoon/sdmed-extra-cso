export enum MedicineMethod {
  ETC = "ETC",
  Oral = "Oral",
  External = "External",
  Inject = "Inject",
  Dental = "Dental",
}

export function allMedicineMethodDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(MedicineMethod).forEach(x => {
    ret.push(StringToMedicineMethodDesc[x]);
  });
  return ret;
}
export function stringToMedicineMethod(data?: string): MedicineMethod {
  if (data == null) {
    return MedicineMethod.ETC;
  }

  return StringToMedicineMethod[data];
}
export function medicineMethodToMedicineMethodDesc(medicineMethod?: MedicineMethod): string {
  return MedicineMethodDesc[medicineMethod ?? MedicineMethod.ETC];
}
export const MedicineMethodDesc: { [key in MedicineMethod]: string } = {
  [MedicineMethod.ETC]: "기타",
  [MedicineMethod.Oral]: "내복",
  [MedicineMethod.External]: "외용",
  [MedicineMethod.Inject]: "주사",
  [MedicineMethod.Dental]: "치과",
}
export const StringToMedicineMethodDesc: { [key in string]: string } = {
  "ETC": "기타",
  "Oral": "내복",
  "External": "외용",
  "Inject": "주사",
  "Dental": "치과",
}
export const StringToMedicineMethod: { [key in string]: MedicineMethod } = {
  "ETC": MedicineMethod.ETC,
  "Oral": MedicineMethod.Oral,
  "External": MedicineMethod.External,
  "Inject": MedicineMethod.Inject,
  "Dental": MedicineMethod.Dental,
}
export const MedicineMethodDescToMedicineMethod: { [key in string]: MedicineMethod } = {
  "기타": MedicineMethod.ETC,
  "내복": MedicineMethod.Oral,
  "외용": MedicineMethod.External,
  "주사": MedicineMethod.Inject,
  "치과": MedicineMethod.Dental,
}
