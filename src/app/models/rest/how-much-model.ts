import {EDIState} from "./edi/edi-state";

export class HowMuchModel {
  hosPK: string = "";
  hospitalName: string = "";
  pharmaPK: string = "";
  pharmaName: string = "";
  medicinePK: string = "";
  medicineName: string = "";
  count: number = 0;
  charge: number = 0;
  price: number = 0;
  ediState: EDIState = EDIState.None;
}
