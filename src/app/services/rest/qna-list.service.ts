import { Injectable } from "@angular/core";
import {HttpResponseInterceptorService} from "../common/http-response-interceptor.service";
import {RestResult} from "../../models/common/rest-result";
import {QnAHeaderModel} from "../../models/rest/qna/qna-header-model";
import {QnAContentModel} from "../../models/rest/qna/qna-content-model";
import {QnAReplyModel} from "../../models/rest/qna/qna-reply-model";

@Injectable({
  providedIn: "root"
})
export class QnaListService {
  private baseUrl = "/apiCSO/extra/qnaList";

  constructor(private httpResponse: HttpResponseInterceptorService) { }

  getList(): Promise<RestResult<QnAHeaderModel[]>> {
    return this.httpResponse.get(`${this.baseUrl}/list`);
  }
  getHeaderData(thisPK: string): Promise<RestResult<QnAHeaderModel>> {
    return this.httpResponse.get(`${this.baseUrl}/data/header/${thisPK}`);
  }
  getContentData(thisPK: string): Promise<RestResult<QnAContentModel>> {
    return this.httpResponse.get(`${this.baseUrl}/data/content/${thisPK}`);
  }
  postData(title: string, qnaContentModel: QnAContentModel): Promise<RestResult<QnAHeaderModel>> {
    this.httpResponse.addParam("title", title);
    return this.httpResponse.post(`${this.baseUrl}/data`, qnaContentModel);
  }
  postReply(thisPK: string, qnaReplyModel: QnAReplyModel): Promise<RestResult<QnAReplyModel>> {
    return this.httpResponse.post(`${this.baseUrl}/data/${thisPK}`, qnaReplyModel);
  }
  putData(thisPK: string): Promise<RestResult<QnAHeaderModel>> {
    return this.httpResponse.put(`${this.baseUrl}/data/${thisPK}`);
  }


}
