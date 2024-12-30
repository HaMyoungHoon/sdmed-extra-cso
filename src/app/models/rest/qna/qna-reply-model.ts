import {QnAReplyFileModel} from "./qna-reply-file-model";

export class QnAReplyModel {
  thisPK: string = "";
  headerPK: string = "";
  userPK: string = "";
  name: string = "";
  content: string = "";
  regDate: Date = new Date();
  fileList: QnAReplyFileModel[] = [];
}
