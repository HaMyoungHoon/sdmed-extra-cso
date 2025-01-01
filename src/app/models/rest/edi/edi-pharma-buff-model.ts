import {EDIMedicineBuffModel} from "./edi-medicine-buff-model";

export class EDIPharmaBuffModel {
  thisPK: string = "";
  code: number = 0;
  orgName: string = "";
  innerName: string = "";
  medicineList: EDIMedicineBuffModel[] = [];
}
