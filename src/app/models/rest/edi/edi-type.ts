export enum EDIType {
  DEFAULT = "DEFAULT",
  NEW = "NEW",
  TRANSFER = "TRANSFER"
}
export function allEDITypeArray(): string[] {
  // 기본은 의미 없으므로 제거한다.
  const ret: string[] = [];
  Object.keys(EDIType).forEach(x => {
    if (x != "DEFAULT") {
      ret.push(x);
    }
  });
  return ret;
}
export function allEDITypeDescArray(): string[] {
  // 기본은 의미 없으므로 제거한다.
  const ret: string[] = [];
  Object.keys(EDIType).forEach(x => {
    if (x != "DEFAULT") {
      ret.push(StringToEDITypeDesc[x]);
    }
  });
  return ret;
}
export const EDITypeDesc: { [key in EDIType]: string } = {
  [EDIType.DEFAULT]: "기본",
  [EDIType.NEW]: "신규처",
  [EDIType.TRANSFER]: "이관처"
}
export const StringToEDITypeDesc: { [key in string]: string } = {
  "DEFAULT": "기본",
  "NEW": "신규처",
  "TRANSFER": "이관처"
}
export const StringToEDIType: { [key in string]: EDIType } = {
  "DEFAULT": EDIType.DEFAULT,
  "NEW": EDIType.NEW,
  "TRANSFER": EDIType.TRANSFER
}
export const EDITypeDescToEDIType: { [key in string]: EDIType } = {
  "기본": EDIType.DEFAULT,
  "신규처": EDIType.NEW,
  "이관처": EDIType.TRANSFER
}
