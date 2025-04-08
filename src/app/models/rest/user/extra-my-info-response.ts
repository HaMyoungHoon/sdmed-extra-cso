import {UserFileModel} from "./user-file-model";
import {UserTrainingModel} from "./user-training-model";
import {ExtraMyInfoHospital} from "./extra-my-info-hospital";

export class ExtraMyInfoResponse {
  thisPK: string = "";
  id: string = "";
  name: string = "";
  companyName: string = "";
  companyNumber: string = "";
  bankAccount: string = "";
  csoReportNumber: string = "";
  contractDate?: Date;
  regDate: Date = new Date();
  lastLoginDate?: Date;
  hosList: ExtraMyInfoHospital[] = [];
  fileList: UserFileModel[] = [];
  trainingList: UserTrainingModel[] = [];
}
