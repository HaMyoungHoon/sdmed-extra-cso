import {UserFileType} from "./user-file-type";

export class UserFileModel {
  thisPK: string = "";
  userPK: string = "";
  blobUrl: string = "";
  originalFilename: string = "";
  mimeType: string = "";
  userFileType: UserFileType = UserFileType.Taxpayer
}
