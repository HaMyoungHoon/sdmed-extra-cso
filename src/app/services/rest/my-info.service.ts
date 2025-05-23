import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {BlobUploadModel} from "../../models/rest/blob-upload-model";
import * as FAmhohwa from "../../guards/f-amhohwa";
import {UserFileType} from "../../models/rest/user/user-file-type";
import {UserFileModel} from "../../models/rest/user/user-file-model";
import {UserTrainingModel} from "../../models/rest/user/user-training-model";
import {ExtraMyInfoResponse} from "../../models/rest/user/extra-my-info-response";

@Injectable({
  providedIn: "root"
})
export class MyInfoService {
  private baseUrl = "/apiCSO/extra/myInfo";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getData(): Promise<RestResult<ExtraMyInfoResponse>> {
    return this.httpResponse.get(`${this.baseUrl}/data`);
  }
  putPasswordChange(currentPW: string, afterPW: string, confirmPW: string): Promise<RestResult<ExtraMyInfoResponse>> {
    this.httpResponse.addParam("currentPW", currentPW);
    this.httpResponse.addParam("afterPW", afterPW);
    this.httpResponse.addParam("confirmPW", confirmPW);
    return this.httpResponse.put(`${this.baseUrl}/passwordChange`);
  }
  putUserFileImageUrl(blobModel: BlobUploadModel, userFileType: UserFileType): Promise<RestResult<UserFileModel>> {
    this.httpResponse.addParam("userFileType", userFileType);
    return this.httpResponse.put(`${this.baseUrl}/file/${FAmhohwa.getThisPK()}`, blobModel);
  }
  postUserTrainingData(blobModel: BlobUploadModel, trainingDate: string): Promise<RestResult<UserTrainingModel>> {
    this.httpResponse.addParam("trainingDate", trainingDate);
    return this.httpResponse.post(`${this.baseUrl}/file/training/${FAmhohwa.getThisPK()}`, blobModel);
  }
}
