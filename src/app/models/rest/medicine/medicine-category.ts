export enum MedicineCategory {
  ETC = "ETC",
  HighRisk = "HighRisk",
  Psychotropic = "Psychotropic"
}

export function allMedicineCategoryDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(MedicineCategory).forEach(x => {
    ret.push(StringToMedicineCategoryDesc[x]);
  });
  return ret;
}
export function stringToMedicineCategory(data?: string): MedicineCategory {
  if (data == null) {
    return MedicineCategory.ETC;
  }

  return StringToMedicineCategory[data];
}
export function medicineCategoryToMedicineCategoryDesc(medicineCategory?: MedicineCategory): string {
  return MedicineCategoryDesc[medicineCategory ?? MedicineCategory.ETC];
}
export const MedicineCategoryDesc: { [key in MedicineCategory]: string } = {
  [MedicineCategory.ETC]: "기타",
  [MedicineCategory.HighRisk]: "오남용우려약품",
  [MedicineCategory.Psychotropic]: "향정신성의약품",
}
export const StringToMedicineCategoryDesc: { [key in string]: string } = {
  "ETC": "기타",
  "HighRisk": "오남용우려약품",
  "Psychotropic": "향정신성의약품",
}
export const StringToMedicineCategory: { [key in string]: MedicineCategory } = {
  "ETC": MedicineCategory.ETC,
  "Oral": MedicineCategory.HighRisk,
  "External": MedicineCategory.Psychotropic,
}
export const MedicineCategoryDescToMedicineCategory: { [key in string]: MedicineCategory } = {
  "기타": MedicineCategory.ETC,
  "오남용우려약품": MedicineCategory.HighRisk,
  "향정신성의약품": MedicineCategory.Psychotropic,
}
