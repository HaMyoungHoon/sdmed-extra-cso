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
export function ediStateToEDIStateDesc(ediState?: EDIState): string {
  return EDIStateDesc[ediState ?? EDIState.None];
}
export const EDIStateDesc: { [key in EDIState]: string } = {
  [EDIState.None]: "미지정",
  [EDIState.OK]: "완료",
  [EDIState.Reject]: "거부",
  [EDIState.Pending]: "보류",
  [EDIState.Partial]: "부분",
}

export const StringToEDIStateDesc: { [key in string]: string } = {
  "None": "미지정",
  "OK": "완료",
  "Reject": "거부",
  "Pending": "보류",
  "Partial": "부분",
}
export const StringToEDIState: { [key in string]: EDIState } = {
  "None": EDIState.None,
  "OK": EDIState.OK,
  "Reject": EDIState.Reject,
  "Pending": EDIState.Pending,
  "Partial": EDIState.Partial,
}
export const EDIStateDescToEDIState: { [key in string]: EDIState } = {
  "미지정": EDIState.None,
  "완료": EDIState.OK,
  "거부": EDIState.Reject,
  "보류": EDIState.Pending,
  "부분": EDIState.Partial,
}
