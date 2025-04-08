import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {ExtraEdiApplyDateResponse} from "../../models/rest/edi/extra-edi-apply-date-response";
import {HospitalModel} from "../../models/rest/hospital/hospital-model";
import {EDIUploadModel} from "../../models/rest/edi/edi-upload-model";
import {ExtraEdiPharmaBuffModel} from "../../models/rest/edi/extra-edi-pharma-buff-model";
import {EDIMedicineBuffModel} from "../../models/rest/edi/edi-medicine-buff-model";
import {ExtraEDIHosBuffModel} from "../../models/rest/edi/extra-edi-hos-buff-model";

@Injectable({
  providedIn: "root"
})
export class EdiRequestService {
  private baseUrl = "/apiCSO/extra/ediRequest";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getApplyDateList(): Promise<RestResult<ExtraEdiApplyDateResponse[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list/applyDate`);
  }
  getHospitalList(applyDate: string): Promise<RestResult<ExtraEDIHosBuffModel[]>> {
    this.httpResponse.addParam("applyDate", applyDate);
    return this.httpResponse.get(`${this.baseUrl}/list/hospital`);
  }
  getPharmaListAll(): Promise<RestResult<ExtraEdiPharmaBuffModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list/pharma`);
  }
  getPharmaList(hosPK: string, applyDate: string): Promise<RestResult<ExtraEdiPharmaBuffModel[]>> {
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
  postNewData(ediUploadModel: EDIUploadModel): Promise<RestResult<EDIUploadModel>> {
    return this.httpResponse.post(`${this.baseUrl}/data/new`, ediUploadModel);
  }
}
