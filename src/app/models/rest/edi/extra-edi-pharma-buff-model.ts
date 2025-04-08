import {EDIMedicineBuffModel} from "./edi-medicine-buff-model";
import {UploadFileBuffModel} from "../../common/upload-file-buff-model";

export class ExtraEdiPharmaBuffModel {
  thisPK: string = "";
  code: string = "";
  orgName: string = "";
  medicineList: EDIMedicineBuffModel[] = [];
  uploadFileBuffModel: UploadFileBuffModel[] = [];
}
