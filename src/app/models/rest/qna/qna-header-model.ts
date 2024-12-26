import {QnAState} from "./qna-state";

export class QnAHeaderModel {
  thisPK: string = "";
  userPK: string = "";
  id: string = "";
  title: string = "";
  regDate: string = "";
  qnaState: QnAState = QnAState.None;
}
