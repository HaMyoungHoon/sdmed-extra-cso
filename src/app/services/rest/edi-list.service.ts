import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {EDIUploadModel} from "../../models/rest/edi/edi-upload-model";
import {RestResult} from "../../models/common/rest-result";
import {EDIUploadFileModel} from "../../models/rest/edi/edi-upload-file-model";
import {EDIUploadPharmaFileModel} from "../../models/rest/edi/edi-upload-pharma-file-model";

@Injectable({
  providedIn: "root"
})
export class EdiListService {
  private baseUrl = "/apiCSO/extra/ediList";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(startDate: string, endDate: string): Promise<RestResult<EDIUploadModel[]>> {
    this.httpResponse.addParam("startDate", startDate);
    this.httpResponse.addParam("endDate", endDate);
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getData(thisPK: string): Promise<RestResult<EDIUploadModel>> {
    return this.httpResponse.get(`${this.baseUrl}/data/${thisPK}`);
  }
  postFile(thisPK: string, ediUploadFileModel: EDIUploadFileModel[]): Promise<RestResult<EDIUploadFileModel[]>> {
    return this.httpResponse.post(`${this.baseUrl}/file/${thisPK}`, ediUploadFileModel);
  }
  postPharmaFile(ediPK: string, ediPharmaPK: string, ediUploadPharmaFileModel: EDIUploadPharmaFileModel[]): Promise<RestResult<EDIUploadPharmaFileModel[]>> {
    return this.httpResponse.post(`${this.baseUrl}/file/${ediPK}/pharma/${ediPharmaPK}`, ediUploadPharmaFileModel);
  }

  deleteEDIFile(thisPK: string): Promise<RestResult<EDIUploadFileModel>> {
    return this.httpResponse.delete(`${this.baseUrl}/data/file/${thisPK}`);
  }
  deleteEDIPharmaFile(thisPK: string): Promise<RestResult<EDIUploadPharmaFileModel>> {
    return this.httpResponse.delete(`${this.baseUrl}/data/pharma/file/${thisPK}`);
  }
}
