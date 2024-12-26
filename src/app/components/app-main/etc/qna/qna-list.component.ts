import { Component } from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";

@Component({
  selector: "app-qna-list",
  templateUrl: "./qna-list.component.html",
  styleUrl: "./qna-list.component.scss",
  standalone: false,
})
export class QnaListComponent extends FComponentBase {
  constructor() {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
  }
}
