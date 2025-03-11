import {HospitalTempTypeCode} from "./hospital-temp-type-code";
import {HospitalTempMetroCode} from "./hospital-temp-metro-code";
import {HospitalTempCityCode} from "./hospital-temp-city-code";
import {HospitalTempFileModel} from "./hospital-temp-file-model";

export class HospitalTempModel {
  thisPK: string = "";
  code: string = "";
  orgName: string = "";
  hospitalTempTypeCode: HospitalTempTypeCode = HospitalTempTypeCode.CODE_00;
  hospitalTempMetroCode: HospitalTempMetroCode = HospitalTempMetroCode.CODE_000000;
  hospitalTempCityCode: HospitalTempCityCode = HospitalTempCityCode.CODE_000000;
  hospitalTempLocalName: string = "";
  zipCode: number = 0;
  address: string = "";
  phoneNumber: string = "";
  websiteUrl: string = "";
  openDate: Date = new Date();
  longitude: number = 0;
  latitude: number = 0;
  fileList: HospitalTempFileModel[] = [];
}
