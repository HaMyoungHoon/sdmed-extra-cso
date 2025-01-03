import {MedicineType} from "./medicine-type";
import {MedicineMethod} from "./medicine-method";
import {MedicineCategory} from "./medicine-category";
import {MedicineGroup} from "./medicine-group";
import {MedicineRank} from "./medicine-rank";
import {MedicineStorageTemp} from "./medicine-storage-temp";
import {MedicineStorageBox} from "./medicine-storage-box";
import {MedicineDiv} from "./medicine-div";

export class MedicineSubModel {
  thisPK: string = "";
  code: string = "";
  standard: string = "";
  accountUnit: number = 0.0;
  medicineType: MedicineType = MedicineType.General;
  medicineMethod: MedicineMethod = MedicineMethod.ETC;
  medicineCategory: MedicineCategory = MedicineCategory.ETC;
  medicineGroup: MedicineGroup = MedicineGroup.Medicine;
  medicineDiv: MedicineDiv = MedicineDiv.Open;
  medicineRank: MedicineRank = MedicineRank.None;
  medicineStorageTemp: MedicineStorageTemp = MedicineStorageTemp.RoomTemp;
  medicineStorageBox: MedicineStorageBox = MedicineStorageBox.Confidential;
  packageUnit: number = 0;
  unit: string = "";
  etc1: string = "";
  etc2: string = "";
}
