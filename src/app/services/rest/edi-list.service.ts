import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {EDIUploadPharmaFileModel} from "../../models/rest/edi/edi-upload-pharma-file-model";
import {ExtraEDIListResponse} from "../../models/rest/edi/extra-edi-list-response";
import {ExtraEDIDetailResponse} from "../../models/rest/edi/extra-edi-detail-response";

@Injectable({
  providedIn: "root"
})
export class EdiListService {
  private baseUrl = "/apiCSO/extra/ediList";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(startDate: string, endDate: string): Promise<RestResult<ExtraEDIListResponse[]>> {
    this.httpResponse.addParam("startDate", startDate);
    this.httpResponse.addParam("endDate", endDate);
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getData(thisPK: string): Promise<RestResult<ExtraEDIDetailResponse>> {
    return this.httpResponse.get(`${this.baseUrl}/data/${thisPK}`);
  }
  postPharmaFile(ediPK: string, ediPharmaPK: string, ediUploadPharmaFileModel: EDIUploadPharmaFileModel[]): Promise<RestResult<EDIUploadPharmaFileModel[]>> {
    return this.httpResponse.post(`${this.baseUrl}/file/${ediPK}/pharma/${ediPharmaPK}`, ediUploadPharmaFileModel);
  }
  deleteEDIPharmaFile(thisPK: string): Promise<RestResult<EDIUploadPharmaFileModel>> {
    return this.httpResponse.delete(`${this.baseUrl}/data/pharma/file/${thisPK}`);
  }
}
