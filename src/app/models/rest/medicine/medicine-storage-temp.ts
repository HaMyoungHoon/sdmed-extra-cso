export enum MedicineStorageTemp {
  RoomTemp = "RoomTemp",
  Cold = "Cold",
}

export function allMedicineStorageTempDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(MedicineStorageTemp).forEach(x => {
    ret.push(StringToMedicineStorageTempDesc[x]);
  });
  return ret;
}
export function stringToMedicineStorageTemp(data?: string): MedicineStorageTemp {
  if (data == null) {
    return MedicineStorageTemp.RoomTemp;
  }

  return StringToMedicineStorageTemp[data];
}
export function medicineStorageTempToMedicineStorageTempDesc(medicineStorageTemp?: MedicineStorageTemp): string {
  return MedicineStorageTempDesc[medicineStorageTemp ?? MedicineStorageTemp.RoomTemp];
}
export const MedicineStorageTempDesc: { [key in MedicineStorageTemp]: string } = {
  [MedicineStorageTemp.RoomTemp]: "실온보관",
  [MedicineStorageTemp.Cold]: "냉장보관",
}
export const StringToMedicineStorageTempDesc: { [key in string]: string } = {
  "RoomTemp": "실온보관",
  "Cold": "냉장보관",
}
export const StringToMedicineStorageTemp: { [key in string]: MedicineStorageTemp } = {
  "RoomTemp": MedicineStorageTemp.RoomTemp,
  "Cold": MedicineStorageTemp.Cold,
}
export const MedicineStorageTempDescToMedicineStorageTemp: { [key in string]: MedicineStorageTemp } = {
  "실온보관": MedicineStorageTemp.RoomTemp,
  "냉장보관": MedicineStorageTemp.Cold,
}
