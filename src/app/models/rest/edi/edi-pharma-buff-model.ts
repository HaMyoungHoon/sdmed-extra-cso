import {EDIMedicineBuffModel} from "./edi-medicine-buff-model";

export class EDIPharmaBuffModel {
  thisPK: string = "";
  code: string = "";
  orgName: string = "";
  innerName: string = "";
  medicineList: EDIMedicineBuffModel[] = [];
}
