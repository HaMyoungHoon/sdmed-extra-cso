export enum MedicineDiv {
  Open = "Open",
  Close = "Close",
}

export function allMedicineDivDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(MedicineDiv).forEach(x => {
    ret.push(StringToMedicineDivDesc[x]);
  });
  return ret;
}
export function stringToMedicineDiv(data?: string): MedicineDiv {
  if (data == null) {
    return MedicineDiv.Open;
  }

  return StringToMedicineDiv[data];
}
export function medicineDivToMedicineDivDesc(medicineDiv?: MedicineDiv): string {
  return MedicineDivDesc[medicineDiv ?? MedicineDiv.Open];
}
export const MedicineDivDesc: { [key in MedicineDiv]: string } = {
  [MedicineDiv.Open]: "공개",
  [MedicineDiv.Close]: "비공개",
}
export const StringToMedicineDivDesc: { [key in string]: string } = {
  "Open": "공개",
  "Close": "비공개",
}
export const StringToMedicineDiv: { [key in string]: MedicineDiv } = {
  "Open": MedicineDiv.Open,
  "Close": MedicineDiv.Close,
}
export const MedicineDivDescToMedicineDiv: { [key in string]: MedicineDiv } = {
  "공개": MedicineDiv.Open,
  "비공개": MedicineDiv.Close,
}

