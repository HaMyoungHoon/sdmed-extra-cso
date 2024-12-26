import {QnAReplyFileModel} from "./qna-reply-file-model";

export class QnAReplyModel {
  thisPK: string = "";
  headerPK: string = "";
  userPK: string = "";
  id: string = "";
  content: string = "";
  regDate: string = "";
  fileList: QnAReplyFileModel[] = [];
}
