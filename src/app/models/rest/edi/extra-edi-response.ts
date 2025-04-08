import {EDIState} from "./edi-state";

export class ExtraEDIResponse {
  thisPK: string = "";
  ediPK: string = "";
  pharmaPK: string = "";
  pharmaName: string = "";
  etc: string = "";
  ediState: EDIState = EDIState.None;
  regDate: Date = new Date()
}
