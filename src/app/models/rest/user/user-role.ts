export enum UserRole {
  None = 0,
  Admin = 1,
  CsoAdmin = Admin.valueOf() << 1,
  Employee = Admin.valueOf() << 2,
  BusinessMan = Admin.valueOf() << 3,
  UserChanger = Admin.valueOf() << 4,
  HospitalChanger = Admin.valueOf() << 5,
  PharmaChanger = Admin.valueOf() << 6,
  MedicineChanger = Admin.valueOf() << 7,
  EdiChanger = Admin.valueOf() << 8,
}

export function allUserRoleDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(UserRole).filter(x => isNaN(Number(x))).forEach(x => {
//    if (x != "Admin" && x != "CsoAdmin") {
      ret.push(StringToUserRoleDesc[x]);
//    }
  });
  return ret;
}
export function stringArrayToUserRole(data: string[]): UserRole[] {
  if (data.length <= 0) {
    return [UserRole.None];
  }

  const ret: UserRole[] = [];
  data.forEach(x => {
    ret.push(UserRoleDescToUserRole[x]);
  });
  return ret;
}
export function flagToUserRole(flags?: number): UserRole[] {
  if (flags == null || flags == 0) {
    return [UserRole.None];
  }
  return Object.values(UserRole).filter((x) => {
    if (typeof x === "number") {
      return (flags & x) !== 0;
    }
    return false;
  }) as UserRole[];
}
export function userRoleToFlag(role: UserRole[]): number {
  return role.reduce((flag, x) => flag | x, 0);
}
export function userRoleToString(role: UserRole[]): string[] {
  return role.map((x) => UserRole[x]);
}
export function flagToRoleDesc(flags?: number): string[] {
  let ret: string[] = [];
  userRoleToString(flagToUserRole(flags)).forEach(x => {
    ret.push(StringToUserRoleDesc[x]);
  });
  return ret;
}
export function haveRole(flags?: number, data: UserRole[] = []): boolean {
  if (flags == null || flags == 0) {
    return false;
  }
  if (data.length <= 0) {
    return true;
  }
  for (const buff of data) {
    if (buff.valueOf() == 0) {
      return true;
    }
    if ((buff.valueOf() & flags) != 0) {
      return true;
    }
  }
  return false;
}
export const StringToUserRoleDesc: { [key in string]: string } = {
  "None" : "미지정",
  "Admin" : "슈퍼관리자",
  "CsoAdmin" : "관리자",
  "Employee" : "직원",
  "BusinessMan" : "영업",
  "UserChanger" : "UserChanger",
  "HospitalChanger" : "HospitalChanger",
  "PharmaChanger" : "PharmaChanger",
  "MedicineChanger" : "MedicineChanger",
  "EdiChanger": "EdiChanger",
}
export const UserRoleDescToUserRole: { [key in string]: UserRole } = {
  "미지정": UserRole.None,
  "슈퍼관리자": UserRole.Admin,
  "관리자": UserRole.CsoAdmin,
  "직원": UserRole.Employee,
  "영업": UserRole.BusinessMan,
  "UserChanger": UserRole.UserChanger,
  "HospitalChanger": UserRole.HospitalChanger,
  "PharmaChanger": UserRole.PharmaChanger,
  "MedicineChanger": UserRole.MedicineChanger,
  "EdiChanger": UserRole.EdiChanger
}
