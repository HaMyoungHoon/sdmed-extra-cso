export class RestResult<T> {
  result?: boolean;
  code?: number;
  msg?: string;
  data?: T;

  constructor(data: T | undefined = undefined) {
    this.data = data;
  }

  get default(): RestResult<T> {
    return this;
  }

  setFail(msg?: string): RestResult<T> {
    this.msg = msg;
    this.result = false;
    return this;
  }
  getResult(data?: T): RestResult<T> {
    this.result = true;
    this.code = 200;
    this.data = data;
    return this;
  }
}
