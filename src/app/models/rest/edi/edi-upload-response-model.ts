import {EDIState} from "./edi-state";

export class EDIUploadResponseModel {
  thisPK: string = "";
  ediPK: string = "";
  userPK: string = "";
  etc: string = "";
  ediState: EDIState = EDIState.None;
  regDate: string = "";
}
