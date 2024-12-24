export enum MedicineRank {
  None = "None",
  Option1 = "Option1",
  Option2 = "Option2",
  Option3 = "Option3",
  Option4 = "Option4",
  Option5 = "Option5",
  Option6 = "Option6",
  Option7 = "Option7",
  Option8 = "Option8",
  Option9 = "Option9",
  Option10 = "Option10",
}

export function allMedicineRankDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(MedicineRank).forEach(x => {
    ret.push(StringToMedicineRankDesc[x]);
  });
  return ret;
}
export function stringToMedicineRank(data?: string): MedicineRank {
  if (data == null) {
    return MedicineRank.None;
  }

  return StringToMedicineRank[data];
}
export function medicineRankToMedicineRankDesc(medicineRank?: MedicineRank): string {
  return MedicineRankDesc[medicineRank ?? MedicineRank.None];
}
export const MedicineRankDesc: { [key in MedicineRank]: string } = {
  [MedicineRank.None]: "미지정",
  [MedicineRank.Option1]: "01.유지(자사생동)",
  [MedicineRank.Option2]: "02.유지(위탁생동)",
  [MedicineRank.Option3]: "03.유지(생동완료)",
  [MedicineRank.Option4]: "04.유지(미대상)",
  [MedicineRank.Option5]: "05.유지(오리지널,DMF)",
  [MedicineRank.Option6]: "06.유지(인하완료)",
  [MedicineRank.Option7]: "07.유지(사유모름)",
  [MedicineRank.Option8]: "08.인하",
  [MedicineRank.Option9]: "09.공지예정(생동진행or계획)",
  [MedicineRank.Option10]: "10.공지없음",
}
export const StringToMedicineRankDesc: { [key in string]: string } = {
  "None": "미지정",
  "Option1": "01.유지(자사생동)",
  "Option2": "02.유지(위탁생동)",
  "Option3": "03.유지(생동완료)",
  "Option4": "04.유지(미대상)",
  "Option5": "05.유지(오리지널,DMF)",
  "Option6": "06.유지(인하완료)",
  "Option7": "07.유지(사유모름)",
  "Option8": "08.인하",
  "Option9": "09.공지예정(생동진행or계획)",
  "Option10": "10.공지없음",
}
export const StringToMedicineRank: { [key in string]: MedicineRank } = {
  "None": MedicineRank.None,
  "Option1": MedicineRank.Option1,
  "Option2": MedicineRank.Option2,
  "Option3": MedicineRank.Option3,
  "Option4": MedicineRank.Option4,
  "Option5": MedicineRank.Option5,
  "Option6": MedicineRank.Option6,
  "Option7": MedicineRank.Option7,
  "Option8": MedicineRank.Option8,
  "Option9": MedicineRank.Option9,
  "Option10": MedicineRank.Option10,
}
export const MedicineRankDescToMedicineRank: { [key in string]: MedicineRank } = {
  "미지정": MedicineRank.None,
  "01.유지(자사생동)": MedicineRank.Option1,
  "02.유지(위탁생동)": MedicineRank.Option2,
  "03.유지(생동완료)": MedicineRank.Option3,
  "04.유지(미대상)": MedicineRank.Option4,
  "05.유지(오리지널,DMF)": MedicineRank.Option5,
  "06.유지(인하완료)": MedicineRank.Option6,
  "07.유지(사유모름)": MedicineRank.Option7,
  "08.인하": MedicineRank.Option8,
  "09.공지예정(생동진행or계획)": MedicineRank.Option9,
  "10.공지없음": MedicineRank.Option10,
}
