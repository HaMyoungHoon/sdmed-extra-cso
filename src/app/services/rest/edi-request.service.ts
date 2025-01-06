import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {EDIApplyDateModel} from "../../models/rest/edi/edi-apply-date-model";
import {HospitalModel} from "../../models/rest/hospital/hospital-model";
import {EDIUploadModel} from "../../models/rest/edi/edi-upload-model";
import {EDIPharmaBuffModel} from "../../models/rest/edi/edi-pharma-buff-model";
import {EDIMedicineBuffModel} from "../../models/rest/edi/edi-medicine-buff-model";
import {EDIHosBuffModel} from "../../models/rest/edi/edi-hos-buff-model";

@Injectable({
  providedIn: "root"
})
export class EdiRequestService {
  private baseUrl = "/apiCSO/extra/ediRequest";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getApplyDateList(): Promise<RestResult<EDIApplyDateModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list/applyDate`);
  }
  getHospitalList(applyDate: string): Promise<RestResult<EDIHosBuffModel[]>> {
    this.httpResponse.addParam("applyDate", applyDate);
    return this.httpResponse.get(`${this.baseUrl}/list/hospital`);
  }
  getPharmaList(hosPK: string, applyDate: string): Promise<RestResult<EDIPharmaBuffModel[]>> {
    this.httpResponse.addParam("applyDate", applyDate);
    return this.httpResponse.get(`${this.baseUrl}/list/pharma/${hosPK}`);
  }
  getMedicineList(hosPK: string, pharmaPK: string[]): Promise<RestResult<EDIMedicineBuffModel[]>> {
    this.httpResponse.addParam("pharmaPK", pharmaPK.join(","));
    return this.httpResponse.get(`${this.baseUrl}/list/medicine/${hosPK}`);
  }

  postData(ediUploadModel: EDIUploadModel): Promise<RestResult<EDIUploadModel>> {
    return this.httpResponse.post(`${this.baseUrl}/data`, ediUploadModel);
  }
}
