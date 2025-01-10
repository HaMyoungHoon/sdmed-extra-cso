import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {HowMuchModel} from "../../models/rest/how-much-model";
import {HowMuchHospitalModel} from "../../models/rest/how-much-hospital-model";
import {HowMuchPharmaModel} from "../../models/rest/how-much-pharma-model";
import {HowMuchMedicineModel} from "../../models/rest/how-much-medicine-model";

@Injectable({
  providedIn: "root"
})
export class DashboardService {
  private baseUrl = "/apiCSO/extra/dashboard";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(date: string): Promise<RestResult<HowMuchModel[]>> {
    this.httpResponse.addParam("date", date);
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getListHos(date: string): Promise<RestResult<HowMuchHospitalModel[]>> {
    this.httpResponse.addParam("date", date);
    return this.httpResponse.get(`${this.baseUrl}/list/hos`);
  }
  getListPharma(date: string): Promise<RestResult<HowMuchPharmaModel[]>> {
    this.httpResponse.addParam("date", date);
    return this.httpResponse.get(`${this.baseUrl}/list/pharma`);
  }
  getListMedicine(date: string): Promise<RestResult<HowMuchMedicineModel[]>> {
    this.httpResponse.addParam("date", date);
    return this.httpResponse.get(`${this.baseUrl}/list/medicine`);
  }

  getListHosDetail(hosPK: string, date: string): Promise<RestResult<HowMuchModel[]>> {
    this.httpResponse.addParam("date", date);
    return this.httpResponse.get(`${this.baseUrl}/list/hos/${hosPK}`);
  }
  getListPharmaDetail(pharmaPK: string, date: string): Promise<RestResult<HowMuchModel[]>> {
    this.httpResponse.addParam("date", date);
    return this.httpResponse.get(`${this.baseUrl}/list/pharma/${pharmaPK}`);
  }
}
