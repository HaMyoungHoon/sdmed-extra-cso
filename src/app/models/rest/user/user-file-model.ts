import {UserFileType} from "./user-file-type";

export class UserFileModel {
  thisPK: string = "";
  userPK: string = "";
  blobUrl: string = "";
  originalFilename: string = "";
  mimeType: string = "";
  regDate: Date = new Date();
  userFileType: UserFileType = UserFileType.Taxpayer
}
