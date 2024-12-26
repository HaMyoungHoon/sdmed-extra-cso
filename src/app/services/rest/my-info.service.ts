import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {UserDataModel} from "../../models/rest/user/user-data-model";
import {BlobUploadModel} from "../../models/rest/blob-upload-model";
import * as FAmhohwa from "../../guards/f-amhohwa";
import * as FExtensions from "../../guards/f-extensions";
import * as FConstants from "../../guards/f-constants";

@Injectable({
  providedIn: "root"
})
export class MyInfoService {
  private baseUrl = "/apiCSO/extra/myInfo";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getData(): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("relationView", true);
    return this.httpResponse.get(`${this.baseUrl}/data`);
  }
  putPasswordChange(currentPW: string, afterPW: string, confirmPW: string): Promise<RestResult<UserDataModel>> {
    this.httpResponse.addParam("currentPW", currentPW);
    this.httpResponse.addParam("afterPW", afterPW);
    this.httpResponse.addParam("confirmPW", confirmPW);
    return this.httpResponse.put(`${this.baseUrl}/passwordChange`);
  }
  putUserTaxImageUrl(blobModel: BlobUploadModel): Promise<RestResult<UserDataModel>> {
    return this.httpResponse.put(`${this.baseUrl}/file/${FAmhohwa.getThisPK()}/taxImage`, blobModel);
  }
  putUserBankImage(blobModel: BlobUploadModel): Promise<RestResult<UserDataModel>> {
    return this.httpResponse.put(`${this.baseUrl}/file/${FAmhohwa.getThisPK()}/bankImage`, blobModel);
  }
}
