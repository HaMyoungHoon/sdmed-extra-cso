export enum MedicineGroup {
  Additional = "Additional",
  Consumable = "Consumable",
  Reagents = "Reagents",
  Medicine = "Medicine",
  NonMedicine = "NonMedicine",
}

export function allMedicineGroupDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(MedicineGroup).forEach(x => {
    ret.push(StringToMedicineGroupDesc[x]);
  });
  return ret;
}
export function stringToMedicineGroup(data?: string): MedicineGroup {
  if (data == null) {
    return MedicineGroup.Additional;
  }

  return StringToMedicineGroup[data];
}
export function medicineGroupToMedicineGroupDesc(medicineGroup?: MedicineGroup): string {
  return MedicineGroupDesc[medicineGroup ?? MedicineGroup.Additional];
}
export const MedicineGroupDesc: { [key in MedicineGroup]: string } = {
  [MedicineGroup.Additional]: "부가제품",
  [MedicineGroup.Consumable]: "소모품",
  [MedicineGroup.Reagents]: "시약",
  [MedicineGroup.Medicine]: "약품",
  [MedicineGroup.NonMedicine]: "의약외품",
}
export const StringToMedicineGroupDesc: { [key in string]: string } = {
  "Additional": "부가제품",
  "Consumable": "소모품",
  "Reagents": "시약",
  "Medicine": "약품",
  "NonMedicine": "의약외품",
}
export const StringToMedicineGroup: { [key in string]: MedicineGroup } = {
  "ETC": MedicineGroup.Additional,
  "Oral": MedicineGroup.Consumable,
  "External": MedicineGroup.Reagents,
  "Inject": MedicineGroup.Medicine,
  "Dental": MedicineGroup.NonMedicine,
}
export const MedicineGroupDescToMedicineGroup: { [key in string]: MedicineGroup } = {
  "부가제품": MedicineGroup.Additional,
  "소모품": MedicineGroup.Consumable,
  "시약": MedicineGroup.Reagents,
  "약품": MedicineGroup.Medicine,
  "의약외품": MedicineGroup.NonMedicine,
}
