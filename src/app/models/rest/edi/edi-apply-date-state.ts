export enum EDIApplyDateState {
  None = "None",
  Use = "Use",
  Expired = "Expired"
}

export function allEDIApplyDateStateDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(EDIApplyDateState).forEach(x => {
    ret.push(StringToEDIApplyDateStateDesc[x]);
  });
  return ret;
}
export function stringToEDIApplyDateState(data?: string): EDIApplyDateState {
  if (data == null) {
    return EDIApplyDateState.None;
  }

  return StringToEDIApplyDateState[data];
}
export function ediApplyDateStateToEDIApplyDateStateDesc(ediApplyDateState?: EDIApplyDateState): string {
  return EDIApplyDateStateDesc[ediApplyDateState ?? EDIApplyDateState.None];
}
export const EDIApplyDateStateDesc: { [key in EDIApplyDateState]: string } = {
  [EDIApplyDateState.None]: "미지정",
  [EDIApplyDateState.Use]: "사용",
  [EDIApplyDateState.Expired]: "만료됨"
}
export const StringToEDIApplyDateStateDesc: { [key in string]: string } = {
  "None": "미지정",
  "Use": "사용",
  "Expired": "만료됨"
}
export const StringToEDIApplyDateState: { [key in string]: EDIApplyDateState } = {
  "None": EDIApplyDateState.None,
  "Use": EDIApplyDateState.Use,
  "Expired": EDIApplyDateState.Expired
}
export const EDIApplyDateStateDescToEDIApplyDateState: { [key in string]: EDIApplyDateState } = {
  "미지정": EDIApplyDateState.None,
  "사용": EDIApplyDateState.Use,
  "만료됨": EDIApplyDateState.Expired
}
