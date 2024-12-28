import {QnAState} from "./qna-state";

export class QnAHeaderModel {
  thisPK: string = "";
  userPK: string = "";
  id: string = "";
  title: string = "";
  regDate: Date = new Date();
  qnaState: QnAState = QnAState.None;
}
