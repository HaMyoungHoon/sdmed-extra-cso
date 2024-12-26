import {QnAFileModel} from "./qna-file-model";
import {QnAReplyModel} from "./qna-reply-model";

export class QnAContentModel {
  thisPK: string = "";
  headerPK: string = "";
  userPK: string = "";
  content: string = "";
  fileList: QnAFileModel[] = [];
  replyList: QnAReplyModel[] = [];
}
