import {HospitalTempTypeCode} from "./hospital-temp-type-code";
import {HospitalTempMetroCode} from "./hospital-temp-metro-code";
import {HospitalTempCityCode} from "./hospital-temp-city-code";

export class PharmacyTempModel {
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
  openDate: Date = new Date();
  longitude: number = 0;
  latitude: number = 0;
}
