export class UserMultiLoginModel {
  thisPK: string = "";
  id: string = "";
  name: string = "";
  token: string = "";
  isLogin: boolean = false;

  safeCopy(rhs: UserMultiLoginModel): UserMultiLoginModel {
    this.thisPK = rhs.thisPK;
    this.id = rhs.id;
    this.name = rhs.name;
    this.token = rhs.token;
    this.isLogin = rhs.isLogin;
    return this;
  }
}
