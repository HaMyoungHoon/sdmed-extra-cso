import { Component } from "@angular/core";
import {FComponentBase} from "../../../guards/f-component-base";
import {UserRole} from "../../../models/rest/user/user-role";

@Component({
  selector: "app-dash-board",
  templateUrl: "./dash-board.component.html",
  styleUrl: "./dash-board.component.scss",
  standalone: false,
})
export class DashBoardComponent extends FComponentBase {
  constructor() {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
  }
}
