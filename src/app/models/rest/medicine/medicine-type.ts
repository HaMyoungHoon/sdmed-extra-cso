export enum MedicineType {
  General = "General",
  Expert = "Expert",
}

export function allMedicineTypeDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(MedicineType).forEach(x => {
    ret.push(StringToMedicineTypeDesc[x]);
  });
  return ret;
}
export function stringToMedicineType(data?: string): MedicineType {
  if (data == null) {
    return MedicineType.General;
  }

  return StringToMedicineType[data];
}
export function medicineTypeToMedicineTypeDesc(medicineType?: MedicineType): string {
  return MedicineTypeDesc[medicineType ?? MedicineType.General];
}
export const MedicineTypeDesc: { [key in MedicineType]: string } = {
  [MedicineType.General]: "일반",
  [MedicineType.Expert]: "전문",
}
export const StringToMedicineTypeDesc: { [key in string]: string } = {
  "General": "일반",
  "Expert": "전문",
}
export const StringToMedicineType: { [key in string]: MedicineType } = {
  "General": MedicineType.General,
  "Expert": MedicineType.Expert,
}
export const MedicineTypeDescToMedicineType: { [key in string]: MedicineType } = {
  "일반": MedicineType.General,
  "전문": MedicineType.Expert,
}
