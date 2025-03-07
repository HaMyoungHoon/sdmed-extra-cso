import {EDIMedicineBuffModel} from "./edi-medicine-buff-model";
import {UploadFileBuffModel} from "../../common/upload-file-buff-model";

export class EDIPharmaBuffModel {
  thisPK: string = "";
  code: string = "";
  orgName: string = "";
  innerName: string = "";
  medicineList: EDIMedicineBuffModel[] = [];
  uploadFileBuffModel: UploadFileBuffModel[] = [];
}
