import {EDIState} from "./edi-state";
import {EDIUploadPharmaModel} from "./edi-upload-pharma-model";
import {EDIUploadFileModel} from "./edi-upload-file-model";
import {EDIUploadResponseModel} from "./edi-upload-response-model";
import {EDIType} from "./edi-type";

export class EDIUploadModel {
  thisPK: string = "";
  userPK: string = "";
  year: string = "";
  month: string = "";
  day: string = "";
  hospitalPK: string = "";
  id: string = "";
  orgName: string = "";
  name: string = "";
  ediState: EDIState = EDIState.None;
  ediType: EDIType = EDIType.DEFAULT;
  regDate: Date = new Date();
  etc: string = "";
  pharmaList: EDIUploadPharmaModel[] = [];
  fileList: EDIUploadFileModel[] = [];
  responseList: EDIUploadResponseModel[] = [];
}
