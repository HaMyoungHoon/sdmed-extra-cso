import {HospitalTempFileType} from "./hospital-temp-file-type";

export class HospitalTempFileModel {
  thisPK: string = "";
  hospitalTempPK: string = "";
  blobUrl: string = "";
  originalFilename: string = "";
  mimeType: string = "";
  fileType: HospitalTempFileType = HospitalTempFileType.TAXPAYER;
  regDate: Date = new Date();
}
