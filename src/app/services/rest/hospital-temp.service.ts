import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {HospitalTempModel} from "../../models/rest/hospital/hospital-temp-model";

@Injectable({
  providedIn: "root"
})
export class HospitalTempService {
  private baseUrl = "/apiCSO/extra/hospitalTemp";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getData(thisPK: string): Promise<RestResult<HospitalTempModel>> {
    return this.httpResponse.get(`${this.baseUrl}/data/${thisPK}`);
  }
  getListSearch(searchString: string): Promise<RestResult<HospitalTempModel[]>> {
    this.httpResponse.addParam("searchString", searchString);
    return this.httpResponse.get(`${this.baseUrl}/list/search`);
  }
  getListNearBy(latitude: number, longitude: number, distance: number = 1000): Promise<RestResult<HospitalTempModel[]>> {
    this.httpResponse.addParam("latitude", latitude);
    this.httpResponse.addParam("longitude", longitude);
    this.httpResponse.addParam("distance", distance);
    return this.httpResponse.get(`${this.baseUrl}/list/nearby`);
  }
}
