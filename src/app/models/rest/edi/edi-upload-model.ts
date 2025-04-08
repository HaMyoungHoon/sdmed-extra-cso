import {EDIState} from "./edi-state";
import {EDIUploadPharmaModel} from "./edi-upload-pharma-model";
import {EDIUploadResponseModel} from "./edi-upload-response-model";
import {EDIType} from "./edi-type";

export class EDIUploadModel {
  thisPK: string = "";
  year: string = "";
  month: string = "";
  hospitalPK: string = "";
  id: string = "";
  orgName: string = "";
  tempHospitalPK: string = "";
  tempOrgName: string = "";
  name: string = "";
  ediState: EDIState = EDIState.None;
  ediStateDesc: string = "";
  ediType: EDIType = EDIType.DEFAULT;
  regDate: Date = new Date();
  pharmaList: EDIUploadPharmaModel[] = [];
}
