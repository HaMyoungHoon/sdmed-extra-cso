import {EDIState} from "./edi-state";

export class EDIUploadResponseModel {
  thisPK: string = "";
  ediPK: string = "";
  pharmaPK: string = "";
  pharmaName: string = "";
  userPK: string = "";
  userName: string = "";
  etc: string = "";
  ediState: EDIState = EDIState.None;
  regDate: Date = new Date();
}
