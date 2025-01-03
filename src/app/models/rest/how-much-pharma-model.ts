import {EDIState} from "./edi/edi-state";

export class HowMuchPharmaModel {
  thisPK: string = "";
  name: string = "";
  count: number = 0;
  price: number = 0.0;
  ediState: EDIState = EDIState.None;
}
