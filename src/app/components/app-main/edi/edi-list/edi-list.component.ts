import {Component} from "@angular/core";
import {FComponentBase} from "../../../../guards/f-component-base";
import {UserRole} from "../../../../models/rest/user/user-role";

@Component({
  selector: "app-edi-list",
  templateUrl: "./edi-list.component.html",
  styleUrl: "./edi-list.component.scss",
  standalone: false,
})
export class EdiListComponent extends FComponentBase{
  constructor() {
    super(Array<UserRole>(UserRole.Admin, UserRole.CsoAdmin, UserRole.BusinessMan));
  }
}
