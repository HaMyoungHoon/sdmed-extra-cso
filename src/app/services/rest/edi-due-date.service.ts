import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {EDIPharmaDueDateModel} from "../../models/rest/edi/edi-pharma-due-date-model";

@Injectable({
  providedIn: "root"
})
export class EdiDueDateService {
  private baseUrl = "/apiCSO/extra/ediDueDate";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(date: string, isYear: boolean = false): Promise<RestResult<EDIPharmaDueDateModel[]>> {
    this.httpResponse.addParam("date", date);
    this.httpResponse.addParam("isYear", isYear);
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getListRange(startDate: string, endDate: string): Promise<RestResult<EDIPharmaDueDateModel[]>> {
    this.httpResponse.addParam("startDate", startDate);
    this.httpResponse.addParam("endDate", endDate);
    return this.httpResponse.get(`${this.baseUrl}/list/range`);
  }
}
