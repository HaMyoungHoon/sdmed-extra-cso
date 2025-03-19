import {UserStatus} from "./user-status";
import {HospitalModel} from "../hospital/hospital-model";
import {UserFileModel} from "./user-file-model";
import {UserTrainingModel} from "./user-training-model";

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
  companyName: string = "";
  companyNumber: string = "";
  companyAddress: string = "";
  bankAccount: string = "";
  csoReportDate?: Date;
  contractDate?: Date;
  regDate: Date = new Date();
  lastLoginDate?: Date;
  motherPK: string = "";
  children: UserDataModel[] = [];
  hosList: HospitalModel[] = [];
  fileList: UserFileModel[] = [];
  trainingList: UserTrainingModel[] = [];
}
