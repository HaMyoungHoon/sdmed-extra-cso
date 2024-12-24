import {EDIState} from "./edi-state";
import {EDIUploadPharmaModel} from "./edi-upload-pharma-model";
import {EDIUploadFileModel} from "./edi-upload-file-model";
import {EDIUploadResponseModel} from "./edi-upload-response-model";

export class EDIUploadModel {
  thisPK: string = "";
  userPK: string = "";
  year: string = "";
  month: string = "";
  day: string = "";
  hospitalPK: string = "";
  orgName: string = "";
  ediState: EDIState = EDIState.None;
  regDate: string = "";
  pharmaList: EDIUploadPharmaModel[] = [];
  fileList: EDIUploadFileModel[] = [];
  responseList: EDIUploadResponseModel[] = [];
}
