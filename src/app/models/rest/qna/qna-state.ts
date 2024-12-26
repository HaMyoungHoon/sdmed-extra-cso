export enum QnAState {
  None = "None",
  OK = "OK",
  Recep = "Recep",
  Reply = "Reply"
}

export function allQnAStateDescArray(): string[] {
  const ret: string[] = [];
  Object.keys(QnAState).forEach(x => {
    ret.push(StringToQnAStateDesc[x]);
  });
  return ret;
}
export function stringToQnAState(data?: string): QnAState {
  if (data == null) {
    return QnAState.None;
  }
  return StringToQnAState[data];
}
export function QnAStateToQnAStateDesc(qnaState?: QnAState): string {
  return QnAStateDesc[qnaState ?? QnAState.None];
}
export const QnAStateDesc: { [key in QnAState]: string } = {
  [QnAState.None]: "미지정",
  [QnAState.OK]: "완료",
  [QnAState.Recep]: "접수",
  [QnAState.Reply]: "답변",
}
export const StringToQnAStateDesc: { [key in string]: string } = {
  "None": "미지정",
  "OK": "완료",
  "Recep": "접수",
  "Reply": "답변",
}
export const StringToQnAState: { [key in string]: QnAState } = {
  "None": QnAState.None,
  "OK": QnAState.OK,
  "Recep": QnAState.Recep,
  "Reply": QnAState.Reply,
}
export const QnAStateDescToQnAState: { [key in string]: QnAState } = {
  "미지정": QnAState.None,
  "완료": QnAState.OK,
  "접수": QnAState.Recep,
  "답변": QnAState.Reply,
}
