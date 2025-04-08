import {EDIState} from "./edi-state";
import {EDIType} from "./edi-type";

export class ExtraEDIListResponse {
  thisPK: string = "";
  year: string = "";
  month: string = "";
  orgName: string = "";
  tempHospitalPK: string = "";
  tempOrgName: string = "";
  ediState: EDIState = EDIState.None;
  ediType: EDIType = EDIType.DEFAULT;
  regDate: Date = new Date();
  ediStateDesc: string = "";
  pharmaList: string[] = [];
}
