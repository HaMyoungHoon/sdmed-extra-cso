import { Component } from "@angular/core";
import {FDialogComponentBase} from "../../../../guards/f-dialog-component-base";
import * as FAmhohwa from "../../../../guards/f-amhohwa";
import * as FConstants from "../../../../guards/f-constants";
import * as FExtensions from "../../../../guards/f-extensions";
import {Password} from "primeng/password";
import {FloatLabel} from "primeng/floatlabel";
import {FormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {InputText} from "primeng/inputtext";

@Component({
  selector: "app-sign-dialog",
  imports: [
    Password,
    FloatLabel,
    FormsModule,
    Button,
    InputText
  ],
  templateUrl: "./sign-dialog.component.html",
  styleUrl: "./sign-dialog.component.scss",
  standalone: true,
})
export class SignDialogComponent extends FDialogComponentBase {
  id: string;
  pw: string;
  constructor() {
    super();
    this.roleCheck = false;
    this.id = "";
    this.pw = "";
  }

  async signIn(): Promise<void> {
    const ret = await FExtensions.restTry(async() => await this.commonService.signIn(this.id, this.pw),
      e => this.fDialogService.error("signIn catch", e));
    if (ret.result) {
      FAmhohwa.setLocalStorage(FConstants.AUTH_TOKEN, ret.data ?? "");
      this.ref.close();
      return;
    }
    this.fDialogService.warn("signIn", ret.msg);
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
