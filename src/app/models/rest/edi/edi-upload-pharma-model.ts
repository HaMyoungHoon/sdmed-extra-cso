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

  init(data: EDIUploadPharmaModel): EDIUploadPharmaModel {
    this.thisPK = data.thisPK;
    this.ediPK = data.ediPK;
    this.pharmaPK = data.pharmaPK;
    this.orgName = data.orgName;
    this.year = data.year;
    this.month = data.month;
    this.day = data.day;
    this.isCarriedOver = data.isCarriedOver;
    this.ediState = data.ediState;
    this.medicineList = data.medicineList;
    this.fileList = data.fileList;
    this.uploadFileBuffModel = data.uploadFileBuffModel;
    return this
  }
}
