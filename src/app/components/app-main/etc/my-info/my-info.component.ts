import { Component } from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";

@Component({
  selector: "app-my-info",
  templateUrl: "./my-info.component.html",
  styleUrl: "./my-info.component.scss",
  standalone: false,
})
export class MyInfoComponent extends FComponentBase {
  constructor() {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
  }
}
