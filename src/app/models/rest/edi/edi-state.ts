export enum EDIState {
  None = "None",
  OK = "OK",
  Reject = "Reject",
  Pending = "Pending",
  Partial = "Partial"
}

export function allEDIStateDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(EDIState).forEach(x => {
    ret.push(StringToEDIStateDesc[x]);
  })
  return ret;
}
export function stringToEDIState(data?: string): EDIState {
  if (data == null) {
    return EDIState.None;
  }

  return StringToEDIState[data];
}
export function EDIStateToEDIStateDesc(ediState?: EDIState): string {
  return EDIStateDesc[ediState ?? EDIState.None];
}
export const EDIStateDesc: { [key in EDIState]: string } = {
  [EDIState.None]: "미처리",
  [EDIState.OK]: "완료",
  [EDIState.Reject]: "불가",
  [EDIState.Pending]: "이월",
  [EDIState.Partial]: "부분처리",
}

export const StringToEDIStateDesc: { [key in string]: string } = {
  "None": "미처리",
  "OK": "완료",
  "Reject": "불가",
  "Pending": "이월",
  "Partial": "부분처리",
}
export const StringToEDIState: { [key in string]: EDIState } = {
  "None": EDIState.None,
  "OK": EDIState.OK,
  "Reject": EDIState.Reject,
  "Pending": EDIState.Pending,
  "Partial": EDIState.Partial,
}
export const EDIStateDescToEDIState: { [key in string]: EDIState } = {
  "미처리": EDIState.None,
  "완료": EDIState.OK,
  "불가": EDIState.Reject,
  "이월": EDIState.Pending,
  "부분처리": EDIState.Partial,
}
