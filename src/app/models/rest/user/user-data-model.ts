import {UserStatus} from "./user-status";
import {HospitalModel} from "../hospital/hospital-model";

export class UserDataModel {
  thisPK: string = "";
  id: string = "";
  pw: string = "";
  name: string = "";
  mail: string = "";
  phoneNumber: string = "";
  role: number = 0;
  dept: number = 0;
  status: UserStatus = UserStatus.None;
  taxpayerImageUrl: string = "";
  companyName: string = "";
  companyNumber: string = "";
  companyAddress: string = "";
  bankAccountImageUrl: string = "";
  bankAccount: string = "";
  regDate: string = "";
  lastLoginDate?: string = "";
  motherPK: string = "";
  children: UserDataModel[] = [];
  hosList: HospitalModel[] = [];
  copyLhsFromRhs(lhs: UserDataModel, rhs: UserDataModel): void {
    lhs.pw = rhs.pw;
    lhs.name = rhs.name;
    lhs.mail = rhs.mail;
    lhs.phoneNumber = rhs.phoneNumber;
    lhs.role = rhs.role;
    lhs.dept = rhs.dept;
    lhs.status = rhs.status;
    lhs.taxpayerImageUrl = rhs.taxpayerImageUrl;
    lhs.companyName = rhs.companyName;
    lhs.companyNumber = rhs.companyNumber;
    lhs.companyAddress = rhs.companyAddress;
    lhs.bankAccountImageUrl = rhs.bankAccountImageUrl;
    lhs.bankAccount = rhs.bankAccount;
    lhs.regDate = rhs.regDate;
    lhs.lastLoginDate = rhs.lastLoginDate;
    lhs.children = rhs.children;
    lhs.hosList = rhs.hosList;
  }
  copyData(data: UserDataModel): void {
    this.pw = data.pw;
    this.name = data.name;
    this.mail = data.mail;
    this.phoneNumber = data.phoneNumber;
    this.role = data.role;
    this.dept = data.dept;
    this.status = data.status;
    this.taxpayerImageUrl = data.taxpayerImageUrl;
    this.companyName = data.companyName;
    this.companyNumber = data.companyNumber;
    this.companyAddress = data.companyAddress;
    this.bankAccountImageUrl = data.bankAccountImageUrl;
    this.bankAccount = data.bankAccount;
    this.regDate = data.regDate;
    this.lastLoginDate = data.lastLoginDate;
    this.children = data.children;
    this.hosList = data.hosList;
  }
  copyDataAll(data: UserDataModel): void {
    this.id = data.id;
    this.pw = data.pw;
    this.name = data.name;
    this.mail = data.mail;
    this.phoneNumber = data.phoneNumber;
    this.role = data.role;
    this.dept = data.dept;
    this.status = data.status;
    this.taxpayerImageUrl = data.taxpayerImageUrl;
    this.companyName = data.companyName;
    this.companyNumber = data.companyNumber;
    this.companyAddress = data.companyAddress;
    this.bankAccountImageUrl = data.bankAccountImageUrl;
    this.bankAccount = data.bankAccount;
    this.regDate = data.regDate;
    this.lastLoginDate = data.lastLoginDate;
    this.children = data.children;
    this.hosList = data.hosList;
  }
}
