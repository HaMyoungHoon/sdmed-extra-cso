import { Injectable } from "@angular/core";
import {RestResult} from "../../models/common/rest-result";
import {UserStatus} from "../../models/rest/user/user-status";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {HttpResponse} from "@angular/common/http";
import {BlobStorageInfoModel} from "../../models/rest/blob-storage-info-model";

@Injectable({
  providedIn: "root"
})
export class CommonService {
  private baseUrl = "/apiCSO/common";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  signIn(id: string, pw: string): Promise<RestResult<string>> {
    this.httpResponse.addParam("id", id);
    this.httpResponse.addParam("pw", pw);
    return this.httpResponse.get(`${this.baseUrl}/signIn`);
  }
  multiSign(token: string): Promise<RestResult<string>> {
    this.httpResponse.addParam("token", token);
    return this.httpResponse.get(`${this.baseUrl}/multiSign`);
  }
  tokenRefresh(): Promise<RestResult<string>> {
    return this.httpResponse.post(`${this.baseUrl}/tokenRefresh`);
  }
  setLanguage(lang: string): Promise<RestResult<null>> {
    this.httpResponse.addParam("lang", lang);
    return this.httpResponse.post(`${this.baseUrl}/lang`);
  }
  getMyRole(): Promise<RestResult<number>> {
    return this.httpResponse.get(`${this.baseUrl}/myRole`);
  }
  getMyState(): Promise<RestResult<UserStatus>> {
    return this.httpResponse.get(`${this.baseUrl}/myState`);
  }
  getBlobStorageInfo(): Promise<RestResult<BlobStorageInfoModel>> {
    return this.httpResponse.get(`${this.baseUrl}/blobStorageInfo`)
  }
  getGenerateSas(blobName: string): Promise<RestResult<BlobStorageInfoModel>> {
    this.httpResponse.addParam("blobName", blobName);
    return this.httpResponse.get(`${this.baseUrl}/generate/sas`);
  }

  downloadFile(url: string): Promise<HttpResponse<Blob>> {
    return this.httpResponse.getBlob(url);
  }
}
