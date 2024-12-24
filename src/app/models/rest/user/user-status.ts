export enum UserStatus {
  None = "None",
  Live = "Live",
  Stop = "Stop",
  Delete = "Delete",
  Expired = "Expired",
}
export function allUserStatusDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(UserStatus).forEach(x => {
    ret.push(StringToUserStatusDesc[x]);
  });
  return ret;
}
export function stringToUserStatus(data?: string): UserStatus {
  if (data == null) {
    return UserStatus.None;
  }

  return StringToUserStatus[data];
}
export function statusToUserStatusDesc(status?: UserStatus): string {
  return UserStatusDesc[status ?? UserStatus.None];
}
export const UserStatusDesc: { [key in UserStatus]: string } = {
  [UserStatus.None]: "미지정",
  [UserStatus.Live]: "라이브",
  [UserStatus.Stop]: "중지됨",
  [UserStatus.Delete]: "삭제됨",
  [UserStatus.Expired]: "만료됨",
}
export const StringToUserStatusDesc: { [key in string]: string } = {
  "None": "미지정",
  "Live": "라이브",
  "Stop": "중지됨",
  "Delete": "삭제됨",
  "Expired": "만료됨",
}
export const StringToUserStatus: { [key in string]: UserStatus } = {
  "None": UserStatus.None,
  "Live": UserStatus.Live,
  "Stop": UserStatus.Stop,
  "Delete": UserStatus.Delete,
  "Expired": UserStatus.Expired,
}
export const StatusDescToUserStatus: { [key in string]: UserStatus } = {
  "미지정": UserStatus.None,
  "라이브": UserStatus.Live,
  "중지됨": UserStatus.Stop,
  "삭제됨": UserStatus.Delete,
  "만료됨": UserStatus.Expired,
}
