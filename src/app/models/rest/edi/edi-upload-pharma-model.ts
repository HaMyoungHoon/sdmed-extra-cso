import {EDIState} from "./edi-state";
import {EDIUploadPharmaMedicineModel} from "./edi-upload-pharma-medicine-model";
import {EDIUploadPharmaFileModel} from "./edi-upload-pharma-file-model";
import {UploadFileBuffModel} from "../../common/upload-file-buff-model";

export class EDIUploadPharmaModel {
  thisPK: string = "";
  ediPK: string = "";
  pharmaPK: string = "";
  orgName: string = "";
  year: string = "";
  month: string = "";
  day: string = "";
  isCarriedOver: boolean = false;
  ediState: EDIState = EDIState.None;
  medicineList: EDIUploadPharmaMedicineModel[] = [];
  fileList: EDIUploadPharmaFileModel[] = [];
  uploadFileBuffModel: UploadFileBuffModel[] = [];
}
