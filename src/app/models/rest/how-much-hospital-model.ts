import {EDIState} from "./edi/edi-state";

export class HowMuchHospitalModel {
  thisPK: string = "";
  name: string = "";
  count: number = 0;
  price: number = 0;
  ediState: EDIState = EDIState.None;
}
