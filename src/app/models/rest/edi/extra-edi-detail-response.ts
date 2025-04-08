import {EDIState} from "./edi-state";
import {EDIType} from "./edi-type";
import {ExtraEDIPharma} from "./extra-edi-pharma";
import {ExtraEDIResponse} from "./extra-edi-response";

export class ExtraEDIDetailResponse {
  thisPK: string = "";
  year: string = "";
  month: string = "";
  orgName: string = "";
  tempHospitalPK: string = "";
  tempOrgName: string = "";
  ediState: EDIState = EDIState.None;
  ediStateDesc: string = "";
  ediType: EDIType = EDIType.DEFAULT;
  regDate: Date = new Date();
  pharmaList: ExtraEDIPharma[] = [];
  responseList: ExtraEDIResponse[] = [];
}
