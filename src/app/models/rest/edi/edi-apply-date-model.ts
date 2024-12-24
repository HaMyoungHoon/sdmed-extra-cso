import {EDIApplyDateState} from "./edi-apply-date-state";

export class EDIApplyDateModel {
  thisPK: string = "";
  year: string = "";
  month: string = "";
  usePK: string = "";
  applyDateState: EDIApplyDateState = EDIApplyDateState.None;
}
