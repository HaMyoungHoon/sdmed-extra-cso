import {Component} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";

@Component({
  selector: "app-edi-request",
  templateUrl: "./edi-request.component.html",
  styleUrl: "./edi-request.component.scss",
  standalone: false,
})
export class EdiRequestComponent extends FComponentBase {
  constructor() {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
  }
}
