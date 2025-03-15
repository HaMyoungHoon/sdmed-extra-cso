import { Component } from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import * as FAmhohwa from "../../../../guards/f-amhohwa";
import * as FExtensions from "../../../../guards/f-extensions";
import {Password} from "primeng/password";
import {FloatLabel} from "primeng/floatlabel";
import {FormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {InputText} from "primeng/inputtext";
import {AppConfigService} from "../../../../services/common/app-config.service";
import {UserMultiLoginModel} from "../../../../models/rest/user/user-multi-login-model";
import {NgIf} from "@angular/common";
import {Listbox} from "primeng/listbox";
import {PrimeTemplate} from "primeng/api";
import {TranslatePipe} from "@ngx-translate/core";
import {Popover} from "primeng/popover";
import {IconField} from "primeng/iconfield";

@Component({
  selector: "app-sign-dialog",
  imports: [Password, FloatLabel, FormsModule, Button, InputText, NgIf, Listbox, PrimeTemplate, TranslatePipe, Popover, IconField],
  templateUrl: "./sign-dialog.component.html",
  styleUrl: "./sign-dialog.component.scss",
  standalone: true,
})
export class SignDialogComponent extends FDialogComponentBase {
  id: string = "";
  pw: string = "";
  multiLogin: UserMultiLoginModel[];
  closable: boolean = false;
  constructor(private appConfig: AppConfigService) {
    super();
    this.roleCheck = false;
    this.multiLogin = appConfig.getLoginData();
    this.closable = this.dialogService.getInstance(this.ref).closable;
  }

  close(): void {
    this.ref.close();
  }
  async signIn(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.commonService.signIn(this.id, this.pw),
      e => this.fDialogService.error("signIn catch", e));
    if (ret.result) {
      FAmhohwa.setToken(ret.data);
      this.addMultiLogin();
      this.ref.close();
      return;
    }
    this.fDialogService.warn("signIn", ret.msg);
  }
  async multiSign(item: UserMultiLoginModel): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.commonService.multiSign(item.token),
      e => this.fDialogService.error("multiSign", e));
    if (ret.result) {
      FAmhohwa.setToken(ret.data);
      this.addMultiLogin();
      this.ref.close();
      return;
    }
    this.fDialogService.warn("multiSign", ret.msg);
    if (ret.code == -10002) {
      this.appConfig.removeMultiLogin(item);
      this.multiLogin = this.appConfig.getLoginData();
    }
  }
  addMultiLogin(): void {
    this.appConfig.addMultiLogin(FExtensions.applyClass(UserMultiLoginModel, obj => {
      obj.thisPK = FAmhohwa.getThisPK();
      obj.id = FAmhohwa.getDecodeUserID();
      obj.name = FAmhohwa.getDecodeUserName();
      obj.token = FAmhohwa.getToken();
      obj.isLogin = true;
    }));
  }
  async idChange(data: any): Promise<void> {
    if (this.signInDisable) {
      return;
    }

    if (data.key == "Enter") {
      await this.signIn();
    }
  }
  async pwChange(data: any): Promise<void> {
    if (this.signInDisable) {
      return;
    }

    if (data.key == "Enter") {
      await this.signIn();
    }
  }

  get signInDisable(): boolean {
    if (this.id.length < 3) {
      return true;
    }
    if (this.pw.length < 4) {
      return true;
    }
    return false;
  }
}
