import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {EDIApplyDateModel} from "../../models/rest/edi/edi-apply-date-model";
import {HospitalModel} from "../../models/rest/hospital/hospital-model";
import {PharmaModel} from "../../models/rest/pharma/pharma-model";
import {MedicineModel} from "../../models/rest/medicine/medicine-model";
import {EDIUploadModel} from "../../models/rest/edi/edi-upload-model";

@Injectable({
  providedIn: "root"
})
export class EdiRequestService {
  private baseUrl = "/apiCSO/extra/ediRequest";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getApplyDateList(): Promise<RestResult<EDIApplyDateModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list/applyDate`);
  }
  getHospitalList(): Promise<RestResult<HospitalModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list/hospital`);
  }
  getPharmaList(hosPK: string): Promise<RestResult<PharmaModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list/pharma/${hosPK}`);
  }
  getMedicineList(hosPK: string, pharmaPK: string[]): Promise<RestResult<MedicineModel[]>> {
    this.httpResponse.addParam("pharmaPK", pharmaPK.join(","));
    return this.httpResponse.get(`${this.baseUrl}/list/medicine/${hosPK}`);
  }

  postData(ediUploadModel: EDIUploadModel): Promise<RestResult<EDIUploadModel>> {
    return this.httpResponse.post(`${this.baseUrl}/data`, ediUploadModel);
  }
}
